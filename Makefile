PROJECT_NAME							:= "web"
PROJECT_AUTHORS 						:= "Timothy Pidashev (timmypidashev) <pidashev.tim@gmail.com>"
PROJECT_VERSION 						:= "v1.0.1"
PROJECT_LICENSE 						:= "MIT"
PROJECT_SOURCES							:= "https://github.com/timmypidashev/web"
PROJECT_REGISTRY						:= "ghcr.io/timmypidashev/web"
PROJECT_ORGANIZATION					:= "org.opencontainers"

CONTAINER_LANDING_NAME					:= "landing"
CONTAINER_LANDING_VERSION				:= "v1.0.0"
CONTAINER_LANDING_LOCATION				:= "src/landing"
CONTAINER_LANDING_DESCRIPTION			:= "The landing page for my website."

CONTAINER_ABOUT_NAME					:= "about"
CONTAINER_ABOUT_VERSION					:= "v0.0.0"
CONTAINER_ABOUT_LOCATION				:= "src/about"
CONTAINER_ABOUT_DESCRIPTION				:= "The about page for my website."

.DEFAULT_GOAL := help
.PHONY: run build push prune bump
.SILENT: run build push prune bump

help:
	@echo "Available targets:"
	@echo "  run           - Runs the docker compose file with the specified environment (dev or prod)"
	@echo "  build         - Builds the specified docker image with the appropriate environment"
	@echo "  push          - Pushes the built docker image to the registry"
	@echo "  prune         - Removes all built and cached docker images and containers"
	@echo "  bump          - Bumps the project and container versions"

run:
	# Arguments:
	# [environment]: 'dev' or 'prod'
	# 
	# Explanation:
	# * Runs the docker compose file with the specified environment(compose.dev.yml, or compose.prod.yml)
	# * Passes all generated arguments to the compose file.
	
	# Make sure we have been given proper arguments.
	@if [ "$(word 2,$(MAKECMDGOALS))" = "dev" ]; then \
		echo "Running in development environment"; \
	elif [ "$(word 2,$(MAKECMDGOALS))" = "prod" ]; then \
		echo "Running in production environment"; \
	else \
		echo "Invalid usage. Please use 'make run dev' or 'make run prod'"; \
		exit 1; \
	fi

	docker compose -f compose.$(word 2,$(MAKECMDGOALS)).yml up --remove-orphans


build:
	# Arguments
	# [container]: Build context(which container to build ['all' to build every container defined])
	# [environment]: 'dev' or 'prod'
	#
	# Explanation:
	# * Builds the specified docker image with the appropriate environment.
	# * Passes all generated arguments to docker build-kit.
	
	# Extract container and environment inputted.
	$(eval INPUT_TARGET := $(word 2,$(MAKECMDGOALS)))
	$(eval INPUT_CONTAINER := $(firstword $(subst :, ,$(INPUT_TARGET))))
	$(eval INPUT_ENVIRONMENT := $(lastword $(subst :, ,$(INPUT_TARGET))))

	# Call function container_build either through a for loop for each container 
	# if all is called, or singularly to build the container.
	$(if $(filter $(strip $(INPUT_CONTAINER)),all), \
		$(foreach container,$(containers),$(call container_build,$(container) $(INPUT_ENVIRONMENT))), \
		$(call container_build,$(INPUT_CONTAINER) $(INPUT_ENVIRONMENT)))

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

prune:
	# Removes all built and cached docker images and containers.

bump:
	@echo "Future: consider adding this; for now manually bumping project and container versions is acceptable :D"

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
	$(eval TAG := $(CONTAINER):$(ENVIRONMENT))

	@echo "Building container: $(CONTAINER)"
	@echo "Environment: $(ENVIRONMENT)"
	@echo "Version: $(VERSION)"

	@if [ "$(strip $(ENVIRONMENT))" != "dev" ] && [ "$(strip $(ENVIRONMENT))" != "prod" ]; then \
        echo "Invalid environment. Please specify 'dev' or 'prod'"; \
        exit 1; \
    fi

	$(if $(filter $(strip $(ENVIRONMENT)),prod), \
		$(eval TAG := $(PROJECT_REGISTRY)/$(CONTAINER):$(VERSION)), \
	)

	sudo mount -o bind src/shared src/landing/landing/shared
	docker buildx build --load -t $(TAG) -f $(strip $(subst $(SPACE),,$(call container_location,$(CONTAINER))))/Dockerfile.$(ENVIRONMENT) ./$(strip $(subst $(SPACE),,$(call container_location,$(CONTAINER))))/. $(ARGS) $(call labels,$(shell echo $(CONTAINER_NAME) | tr '[:lower:]' '[:upper:]')) --no-cache
	sudo umount /src/landing/landing/shared
endef

define container_location
    $(strip $(eval CONTAINER_NAME := $(shell echo $(1) | tr '[:lower:]' '[:upper:]'))) \
    $(CONTAINER_$(CONTAINER_NAME)_LOCATION)
endef

define container_version
	$(strip $(eval CONTAINER_NAME := $(shell echo $(1) | tr '[:lower:]' '[:upper:]'))) \
	$(if $(CONTAINER_$(CONTAINER_NAME)_VERSION), \
		$(shell echo $(strip $(strip $(CONTAINER_$(CONTAINER_NAME)_VERSION))) | tr -d '[:space:]'), \
		$(error Version data for container $(1) not found))
endef

define mount_shared
	$(sudo mount -o bind src/shared src/landing/landing/shared)
endef

define unmount_shared
	$(sudo umount src/shared)
endef
