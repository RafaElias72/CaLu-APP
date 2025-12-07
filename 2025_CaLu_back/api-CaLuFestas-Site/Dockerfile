
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install git for fetching dependencies
RUN apk add --no-cache git

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source from the current directory to the working Directory inside the container
COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

######## Start a new stage from scratch #######
FROM alpine:latest  

WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

# Copy environment file if it exists (optional, safer to rely on docker-compose envs but keeping structure)
# Note: In production/docker, we often pass env vars directly. 
# Attempting to copy .env if it exists, but usually we don't copy .env in docker builds to avoid secrets leak.
# However, for local dev setup request, this is often convenient. 
# We'll skip copying .env and rely on volume or docker-compose env_file.

EXPOSE 8080

CMD ["./main"]
