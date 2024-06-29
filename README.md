# Deploy Node.js App on AWS EC2 with Docker

[![Outlook](https://img.shields.io/badge/Outlook-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white)](mailto:engzaman2020@outlook.com) [![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ahmad-awsaf-uz-zaman/)

## Launch an EC2 Instance

1. **Log in to AWS Management Console:**

	- Go to the AWS Management Console.
	- Log in with your AWS credentials.

2. **Launch an Instance:**

	- Navigate to the EC2 Dashboard and click "Launch Instance."
	- Choose an Amazon Machine Image (AMI). Select "Amazon Linux 2 AMI" or "Ubuntu Server."
	- Choose an Instance Type. Select t2.micro if you are using the free tier.
	- Configure Instance Details, then click "Next: Add Storage."
	- Add Storage (default is fine), then click "Next: Add Tags."
	- Add Tags (optional), then click "Next: Configure Security Group."
	- Configure Security Group. Add rules to allow SSH (port 22) and HTTP (port 80) access.
	- Review and Launch the instance. Download the key pair (.pem file) and save it securely.

## Connect to the EC2 instance

1. **Open Terminal/Command Prompt:**

	- Navigate to the directory where your .pem file is located.

2. **Change Permissions of the Key Pair File:**
```bash
chmod 400 your-key-pair.pem
```

3. **Connect to the Instance:**
```bash
ssh -i "your-key-pair.pem" ec2-user@your-ec2-instance-public-dns
```

## Install Docker on the EC2 Instance

1. Update the Package Index:
```bash
sudo apt-get update -y
```

2. Install Docker:
```bash
sudo apt-get install -y docker.io
```

3. Start Docker Service:
```bash
sudo systemctl start docker
```

4. Add the EC2 User to the Docker Group:
```bash
sudo usermod -aG docker $USER
```

5. Logout and Reconnect to the Instance:

- This step is necessary for the group change to take effect.
```bash
exit
ssh -i "your-key-pair.pem" ec2-user@your-ec2-instance-public-dns
```

6. Verify Docker Installation:
```bash
docker --version
 ```
 
## Use the Dockerfile for the Node.js Application
 
1. Location of the Dockerfile:
<https://github.com/awsaf-utm/Deploy-Node.js-App-on-AWS-EC2-with-Docker/blob/main/Dockerfile>


 ```
# Stage 1: Build Stage
FROM ubuntu:20.04 AS builder

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Stage 2: Production Stage
FROM gcr.io/distroless/nodejs:14

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app .

# Expose the port the app runs on
EXPOSE 3001

# Set the command to run the application
ENTRYPOINT ["/nodejs/bin/node", "index.js"]
```


2. Build and Push Docker Image: 
 
- Build your Docker image locally:
```bash
docker build -t your-node-app .
```

- (Optional) Push your Docker image to a container registry like Docker Hub:
	- docker tag your-node-app your-dockerhub-username/your-node-app
	- docker push your-dockerhub-username/your-node-app

## Run the Docker Container on EC2
  
1. Pull the Docker Image on EC2 (if pushed to Docker Hub):
```bash
docker pull your-dockerhub-username/your-node-app
```

2. Run the Docker Container:
```bash
docker run -d -p 3001:3001 your-node-app
```

3. Verify the Application is Running:
	- Open your browser and navigate to http://your-ec2-instance-public-dns:3001.

## Configure Security Group for Port 3001

- Update Security Group:
	- Go to the EC2 Dashboard.
	- Select your instance.
	- In the Description tab, click on the security group.
	- Click on "Edit inbound rules".
	- Add a rule to allow traffic on port 3001:
	- Type: Custom TCP
	- Port Range: 3001
	- Source: 0.0.0.0/0 (for testing purposes, restrict this in production)

###### Now your Node.js application should be accessible from the internet.

## Troubleshooting Tips:
- Ensure that your security group settings are correct.
- Verify that your application is correctly listening on the specified port.
- Check Docker container logs for any errors using:
```bash
docker logs <container-id>
```
###### This guide should help you deploy your Node.js application on an AWS EC2 instance using Docker based on Ubuntu.

 