# Use the specified base image
FROM node:lts-bullseye-slim

# Create a new directory for the app
WORKDIR /app

# Copy package.json and package-lock.json to the app directory
COPY package.json ./

# Install app dependencies
RUN npm run buildinstall

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
