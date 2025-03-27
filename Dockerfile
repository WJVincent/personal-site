# Use Node.js 20 as the base image
FROM node:20-alpine

# Install ripgrep
RUN apk add --no-cache ripgrep

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (for npm dependencies)
COPY package*.json ./

# Install app dependencies
RUN npm install --production

# Copy the rest of your application files (everything except node_modules)
COPY . .

# Expose the app port (adjust this based on your app's configuration)
EXPOSE 3000

RUN ./get_tags.sh

# Command to run the app
CMD ["node", "app.js"]
