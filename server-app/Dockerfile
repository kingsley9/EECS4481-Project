# Use the specified base image
FROM node:lts-bullseye-slim

# Create a new directory for the app
WORKDIR /app

# Copy package.json and package-lock.json to the app directory
COPY package.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3100

# Set environment variables
ARG DB_USER
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG DB_DATABASE
ARG JWT_SECRET

ENV PGUSER=$DB_USER
ENV PGPASSWORD=$DB_PASSWORD
ENV PGHOST=$DB_HOST
ENV PGPORT=$DB_PORT
ENV PGDATABASE=$DB_DATABASE
ENV JWT_SECRET=$JWT_SECRET

# Start the server
CMD ["npm", "start"]
