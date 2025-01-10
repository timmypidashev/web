PROJECT_NAME							:= "timmypidashev.dev"
PROJECT_AUTHORS 						:= "Timothy Pidashev (timmypidashev) <pidashev.tim@gmail.com>"
PROJECT_VERSION 						:= "v1.0.1"
PROJECT_LICENSE 						:= "MIT"
PROJECT_SOURCES							:= "https://github.com/timmypidashev/web"
PROJECT_REGISTRY						:= "ghcr.io/timmypidashev/web"
PROJECT_ORGANIZATION					:= "org.opencontainers"

CONTAINER_WEB_NAME						:= "web"
CONTAINER_WEB_VERSION					:= "v1.0.1"
CONTAINER_WEB_LOCATION					:= "src/"
CONTAINER_WEB_DESCRIPTION				:= "My portfolio website!"

.DEFAULT_GOAL := help
.PHONY: watch run build push prune bump exec
.SILENT: watch run build push prune bump exec

help:
	@echo "Available targets:"
	@echo "  run           - Runs the docker compose file with the specified environment (local, dev, preview, or release)"
	@echo "  build         - Builds the specified docker image with the appropriate environment"
	@echo "  push          - Pushes the built docker image to the registry"
	@echo "  pull					 - Pulls the latest specified docker image from the registry"
	@echo "  prune         - Removes all built and cached docker images and containers"
	@echo "  bump          - Bumps the project and container versions"
	@echo "  exec          - Spawns a shell to execute commands from within a running container"

build:
	# Arguments
	# [container]: Build context(which container to build ['all' to build every container defined])
	# [environment]: 'local', 'dev', 'preview', or 'release'
	#
	# Explanation:
	# * Builds the specified docker image with the appropriate environment.
	# * Passes all generated arguments to docker build-kit.
	# * Installs pre-commit hooks if in a git repository.
	
	# Install pre-commit hooks if in a git repository.
	$(call install_precommit)
	
	# Extract container and environment inputted.
	$(eval INPUT_TARGET := $(word 2,$(MAKECMDGOALS)))
	$(eval INPUT_CONTAINER := $(firstword $(subst :, ,$(INPUT_TARGET))))
	$(eval INPUT_ENVIRONMENT := $(lastword $(subst :, ,$(INPUT_TARGET))))

	# Call function container_build either through a for loop for each container 
	# if all is called, or singularly to build the container.
	$(if $(filter $(strip $(INPUT_CONTAINER)),all), \
		$(foreach container,$(containers),$(call container_build,$(container) $(INPUT_ENVIRONMENT))), \
		$(call container_build,$(INPUT_CONTAINER) $(INPUT_ENVIRONMENT)))

run:
	# Arguments:
	# [environment]: 'local', 'dev', 'preview', or 'release'
	# 
	# Explanation:
	# * Runs the docker compose file with the specified environment(compose.local.yml, compose.dev.yml, compose.preview.yml, or compose.release.yml)
	# * Passes all generated arguments to the compose file.
	# * Installs pre-commit hooks if in a git repository.
	
	# Install pre-commit hooks if in a git repository.
	$(call install_precommit)

	# Make sure we have been given proper arguments.
	@if [ "$(word 2,$(MAKECMDGOALS))" = "local" ]; then \
		echo "Running in local environment"; \
		docker compose -f compose.$(word 2,$(MAKECMDGOALS)).yml up --watch --remove-orphans; \
	elif [ "$(word 2,$(MAKECMDGOALS))" = "preview" ]; then \
		echo "Running in preview environment"; \
		docker compose -f compose.$(word 2,$(MAKECMDGOALS)).yml up --remove-orphans; \
	elif [ "$(word 2,$(MAKECMDGOALS))" = "release" ]; then \
		echo "Running in release environment"; \
		docker compose -f compose.$(word 2,$(MAKECMDGOALS)).yml up --remove-orphans; \
	else \
		echo "Invalid usage. Please use 'make run <'local', 'dev', 'preview', or 'release'>"; \
		exit 1; \
	fi 

push:
	# Arguments
	# [container]: Push context(which container to push to the registry)
	# [version]: Container version to push.
	#
	# Explanation:
	# * Pushes the specified container version to the registry defined in the user configuration.
	
	# Extract container and version inputted.
	$(eval INPUT_TARGET := $(word 2,$(MAKECMDGOALS)))
	$(eval INPUT_CONTAINER := $(firstword $(subst :, ,$(INPUT_TARGET))))
	$(eval INPUT_VERSION := $(lastword $(subst :, ,$(INPUT_TARGET))))
	
	# Push the specified container version to the registry.
	# NOTE: docker will complain if the container tag is invalid, no need to validate here.
	@docker push $(PROJECT_REGISTRY)/$(INPUT_CONTAINER):$(INPUT_VERSION)

pull:
	# TODO: FIX COMMAND PULL
	# Arguments
	# [container]: Pull context (which container to pull from the registry)
	# [environment]: 'local', 'dev', 'preview', or 'release'
	#
	# Explanation:
	# * Pulls the specified container version from the registry defined in the user configuration.
	# * Uses sed and basename to extract the repository name.
	
	# Extract container and environment inputted.
	$(eval INPUT_TARGET := $(word 2,$(MAKECMDGOALS)))
	$(eval INPUT_CONTAINER := $(firstword $(subst :, ,$(INPUT_TARGET))))
	$(eval INPUT_ENVIRONMENT := $(lastword $(subst :, ,$(INPUT_TARGET))))
	
	# Validate environment
	@if [ "$(strip $(INPUT_ENVIRONMENT))" != "local" ] [ "$(strip $(INPUT_ENVIRONMENT))" != "dev" ] && [ "$(strip $(INPUT_ENVIRONMENT))" != "preview" ] && [ "$(strip $(INPUT_ENVIRONMENT))" != "release" ]; then \
			echo "Invalid environment. Please specify 'local', 'dev', 'preview', or 'release'"; \
			exit 1; \
	fi
	
	# Extract repository name from PROJECT_SOURCES using sed and basename
	$(eval REPO_NAME := $(shell echo "$(PROJECT_SOURCES)" | sed 's|https://github.com/[^/]*/||' | sed 's/\.git$$//' | xargs basename))
	
	# Determine the correct tag based on the environment and container
	$(eval TAG := $(if $(filter $(INPUT_ENVIRONMENT),local),\
									 $(INPUT_CONTAINER):$(INPUT_ENVIRONMENT),\
								 $(if $(filter $(INPUT_CONTAINER),$(REPO_NAME)),\
									 $(PROJECT_REGISTRY):$(if $(filter $(INPUT_ENVIRONMENT),prev),prev,$(call container_version,$(INPUT_CONTAINER))),\
									 $(PROJECT_REGISTRY)/$(INPUT_CONTAINER):$(if $(filter $(INPUT_ENVIRONMENT),prev),prev,$(call container_version,$(INPUT_CONTAINER))))))
	
	# Pull the specified container from the registry
	@echo "Pulling container: $(INPUT_CONTAINER)"
	@echo "Environment: $(INPUT_ENVIRONMENT)"
	@echo "Tag: $(TAG)"
	@docker pull $(TAG)

prune:
	# TODO: IMPLEMENT COMMAND PRUNE
	# Removes all built and cached docker images and containers.

bump:
	# Arguments
	# [container]: Bump context(which container version to bump)
	# [semantic_type]: Semantic type context(major, minor, patch)
	#
	# Explanation:
	# * Bumps the specified container version within the makefile config and the container's package.json.
	# * Bumps the global project version in the makefile, and creates a new git tag with said version.
	
	# Extract container and semantic_type inputted.
	$(eval INPUT_TARGET := $(word 2,$(MAKECMDGOALS)))
	$(eval INPUT_CONTAINER := $(firstword $(subst :, ,$(INPUT_TARGET))))
	$(eval INPUT_SEMANTIC_TYPE := $(lastword $(subst :, ,$(INPUT_TARGET))))
	
	# Extract old container and project versions.
	$(eval OLD_CONTAINER_VERSION := $(subst v,,$(CONTAINER_$(shell echo $(INPUT_CONTAINER) | tr a-z A-Z)_VERSION)))
	$(eval OLD_PROJECT_VERSION := $(subst v,,$(PROJECT_VERSION)))

	# Pull docker semver becsause the normal command doesn't seem to work; also we don't need to worry about dependencies.
	docker pull usvc/semver:latest

	# Bump npm package.json file for selected container
	cd $(call container_location,$(INPUT_CONTAINER)) && npm version $(shell docker run usvc/semver:latest bump $(INPUT_SEMANTIC_TYPE) $(OLD_CONTAINER_VERSION))

	# Bump the git tag to match the new global version
	git tag v$(shell docker run usvc/semver:latest bump $(INPUT_SEMANTIC_TYPE) $(OLD_PROJECT_VERSION))
	
	# Bump the container version and global version in the Makefile
	perl -pi -e 's/^PROJECT_VERSION\s*:=\s*\K.*/"v$(shell docker run usvc/semver:latest bump $(INPUT_SEMANTIC_TYPE) $(OLD_PROJECT_VERSION))"/ if /^PROJECT_VERSION\s*:=/' Makefile;
	perl -pi -e 's/^CONTAINER_$(shell echo $(INPUT_CONTAINER) | tr a-z A-Z)_VERSION\s*:=\s*\K.*/"v$(shell docker run usvc/semver:latest bump $(INPUT_SEMANTIC_TYPE) $(OLD_CONTAINER_VERSION))"/ if /^CONTAINER_$(shell echo $(INPUT_CONTAINER) | tr a-z A-Z)_VERSION\s*:=/' Makefile;

	# Commit and push to git origin
	git add .
	git commit -a -S -m "Bump $(INPUT_CONTAINER) to v$(shell docker run usvc/semver:latest bump $(INPUT_SEMANTIC_TYPE) $(OLD_PROJECT_VERSION))"
	git push
	git push origin tag v$(shell docker run usvc/semver:latest bump $(INPUT_SEMANTIC_TYPE) $(OLD_PROJECT_VERSION))

exec:
	# Extract container and environment inputted.
	$(eval INPUT_TARGET := $(word 2,$(MAKECMDGOALS)))
	$(eval INPUT_CONTAINER := $(firstword $(subst :, ,$(INPUT_TARGET))))
	$(eval INPUT_ENVIRONMENT := $(lastword $(subst :, ,$(INPUT_TARGET))))
	$(eval COMPOSE_FILE := compose.$(INPUT_ENVIRONMENT).yml)
	
	docker compose -f $(COMPOSE_FILE) run --service-ports $(INPUT_CONTAINER) sh

# This function generates Docker build arguments based on variables defined in the Makefile.
# It extracts variable assignments, removes whitespace, and formats them as build arguments.
# Additionally, it appends any custom shell generated arguments defined below.
define args
    $(shell \
        grep -E '^[[:alnum:]_]+[[:space:]]*[:?]?[[:space:]]*=' $(MAKEFILE_LIST) | \
        awk 'BEGIN {FS = ":="} { \
            gsub(/^[[:space:]]+|[[:space:]]+$$/, "", $$2); \
            gsub(/^/, "\x27", $$2); \
            gsub(/$$/, "\x27", $$2); \
            gsub(/[[:space:]]+/, "", $$1); \
            gsub(":", "", $$1); \
            printf "--build-arg %s=%s ", $$1, $$2 \
        }') \
				--build-arg ENVIRONMENT='"$(shell echo $(INPUT_ENVIRONMENT))"' \
        --build-arg BUILD_DATE='"$(shell date)"' \
		--build-arg GIT_COMMIT='"$(shell git rev-parse HEAD)"'
endef

# This function generates labels based on variables defined in the Makefile.
# It extracts only the selected container variables and is used to echo this information
# to the docker buildx engine in the command line.
define labels
	--label $(PROJECT_ORGANIZATION).image.title=$(CONTAINER_$(1)_NAME) \
	--label $(PROJECT_ORGANIZATION).image.description=$(CONTAINER_$(1)_DESCRIPTION) \
	--label $(PROJECT_ORGANIZATION).image.authors=$(PROJECT_AUTHORS) \
	--label $(PROJECT_ORGANIZATION).image.url=$(PROJECT_SOURCES) \
	--label $(PROJECT_ORGANIZATION).image.source=$(PROJECT_SOURCES)/$(CONTAINER_$(1)_LOCATION)
endef

# This function returns a list of container names defined in the Makefile.
# In order for this function to return a container, it needs to have this format: CONTAINER_%_NAME!
define containers
    $(strip $(filter-out $(_NL),$(foreach var,$(.VARIABLES),$(if $(filter CONTAINER_%_NAME,$(var)),$(strip $($(var)))))))
endef

define container_build
	$(eval CONTAINER := $(word 1,$1))
	$(eval ENVIRONMENT := $(word 2,$1))
	$(eval ARGS := $(shell echo $(args)))
	$(eval VERSION := $(strip $(call container_version,$(CONTAINER))))
	$(eval PROJECT := $(strip $(subst ",,$(PROJECT_NAME))))
	$(eval TAG := $(PROJECT).$(CONTAINER):$(ENVIRONMENT))

	@echo "Building container: $(CONTAINER)"
	@echo "Environment: $(ENVIRONMENT)"
	@echo "Version: $(VERSION)"

	@if [ "$(strip $(ENVIRONMENT))" != "local" ] && [ "$(strip $(ENVIRONMENT))" != "dev" ] && [ "$(strip $(ENVIRONMENT))" != "preview" ] && [ "$(strip $(ENVIRONMENT))" != "release" ]; then \
        echo "Invalid environment. Please specify 'local', 'dev', 'preview', or 'release'"; \
        exit 1; \
    fi
	
	docker buildx build --no-cache --load -t $(TAG) -f .docker/Dockerfile.$(ENVIRONMENT) ./$(strip $(subst $(SPACE),,$(call container_location,$(CONTAINER))))/. $(ARGS) $(call labels,$(shell echo $(CONTAINER_NAME) | tr '[:lower:]' '[:upper:]')) --debug
endef

define container_location
    $(strip $(eval CONTAINER_NAME := $(shell echo $(1) | tr '[:lower:]' '[:upper:]'))) \
    $(CONTAINER_$(CONTAINER_NAME)_LOCATION)
endef

define container_name
		$(strip $(shell echo '$(1)' | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]'))
endef

define container_version
	$(strip $(eval CONTAINER_NAME := $(shell echo $(1) | tr '[:lower:]' '[:upper:]'))) \
	$(if $(CONTAINER_$(CONTAINER_NAME)_VERSION), \
		$(shell echo $(strip $(strip $(CONTAINER_$(CONTAINER_NAME)_VERSION))) | tr -d '[:space:]'), \
		$(error Version data for container $(1) not found))
endef

define install_precommit
	$(strip \
		$(shell \
			if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then \
				pre-commit install > /dev/null 2>&1; \
			fi \
		) \
	)
endef

%:
	@:
