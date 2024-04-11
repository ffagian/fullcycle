# Minimal image
FROM golang:alpine as builder

# Copy main.go to container
COPY main.go .

# To Compile go file
RUN go build -o /app main.go

# Use minimal image in the final
FROM scratch

# Copy the run to compilud to previous stage
COPY --from=builder /app /app

# Definir o comando padrão para o contêiner
CMD ["/app"]
