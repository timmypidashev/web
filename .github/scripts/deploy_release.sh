#!/bin/sh

# Set variables
BRANCH_NAME="$1"
COMMIT_HASH="$2"
GHCR_USERNAME="$3"
GHCR_TOKEN="$4"
DEPLOY_TYPE="$5"
REPO_OWNER="$6"
COMPOSE_FILE="$7"
CADDYFILE="$8"
MAKEFILE="$9"

# Echo out variable names and their content on single lines
echo "BRANCH_NAME: $BRANCH_NAME"
echo "COMMIT_HASH: $COMMIT_HASH"
echo "GHCR_USERNAME: $GHCR_USERNAME"
echo "DEPLOY_TYPE: $DEPLOY_TYPE"
echo "REPO_OWNER: $REPO_OWNER"
echo "COMPOSE_FILE: $COMPOSE_FILE"
echo "CADDYFILE: $CADDYFILE"
echo "MAKEFILE: $MAKEFILE"

# Set the staging directory
STAGING_DIR="/root/deployments/.staging-${COMMIT_HASH}"

# Set the tmux session name for release
TMUX_SESSION="deployment-release"

# Function to cleanup existing release deployment
cleanup_release_deployment() {
    echo "Cleaning up existing release deployment..."
    # Stop and remove all release containers
    docker-compose -f "/root/deployments/release/docker-compose.yml" down -v 2>/dev/null
    # Remove release images
    docker rmi $(docker images "ghcr.io/$REPO_OWNER/*:release" -q) 2>/dev/null
    # Kill release tmux session if it exists
    tmux kill-session -t "$TMUX_SESSION" 2>/dev/null
    # Remove release deployment directory
    rm -rf /root/deployments/release
}

# Function to create deployment directory
create_deployment_directory() {
    echo "Creating deployment directory..."
    mkdir -p /root/deployments/release
}

# Function to pull Docker images
pull_docker_images() {
    echo "Pulling Docker images..."
    docker pull ghcr.io/$REPO_OWNER/web:release
}

# Function to copy and prepare files
copy_and_prepare_files() {
    echo "Copying and preparing files..."
    # Copy files preserving names and locations
    install -D "$STAGING_DIR/$COMPOSE_FILE" "/root/deployments/release/$COMPOSE_FILE"
    install -D "$STAGING_DIR/$CADDYFILE" "/root/deployments/release/$CADDYFILE"
    install -D "$STAGING_DIR/$MAKEFILE" "/root/deployments/release/$MAKEFILE"
    # Replace {$COMMIT_HASH} with $COMMIT_HASH in $CADDYFILE
    sed -i "s/{\$COMMIT_HASH}/$COMMIT_HASH/g" "/root/deployments/release/$CADDYFILE"
    # Replace {commit_hash} with $COMMIT_HASH in $COMPOSE_FILE
    sed -i "s/{commit_hash}/$COMMIT_HASH/g" "/root/deployments/release/$COMPOSE_FILE"
}

# Function to start the deployment
start_deployment() {
    echo "Starting deployment..."
    # Create new tmux session with specific name
    tmux new-session -d -s "$TMUX_SESSION"
    tmux send-keys -t "$TMUX_SESSION" "cd /root/deployments/release && make run release" Enter
}

# Main execution
cleanup_release_deployment
create_deployment_directory
copy_and_prepare_files
cd "/root/deployments/release"
pull_docker_images
start_deployment
echo "Release build $COMMIT_HASH deployed successfully!"
