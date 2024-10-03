# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Build the NestJS application (if you have a build step)
RUN npm run build

# Command to run the application
CMD ["node", "dist/main.js"]