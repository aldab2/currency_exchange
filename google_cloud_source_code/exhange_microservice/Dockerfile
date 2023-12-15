# Use the official Node.js 16 image as a parent image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Make the container's port 3000 available to the outside world
EXPOSE 5002

# Run the command "npm start" inside your image filesystem.
CMD ["npm", "start"]
