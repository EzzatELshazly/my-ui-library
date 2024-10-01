# CI/CD Pipeline for React and TypeScript UI Library Using Jenkins
## Overview:
In this project, we have implemented a continuous integration and continuous deployment (CI/CD) pipeline for a React UI library written in TypeScript using Jenkins. This pipeline automates the process of building, testing, and publishing the library to the npm registry, ensuring that any changes made to the codebase are consistently integrated and delivered. By leveraging Jenkins, we can continuously monitor the source code repository, automate the build process, and quickly release updates to npm without manual intervention.

## Prerequisites
Before setting up the Jenkins pipeline, ensure you have the following:
- Linux Redhat 9 machine
- A Jenkins server up and running.
- Node.js installed on the Jenkins server.
- npm account with necessary permissions to publish packages.
- A GitHub repository (private) to store your code.

## Architecture: 
The pipeline involves several stages:

- Source Control (GitHub): The source code is hosted on GitHub, which Jenkins monitors for changes.
- Build Automation: Using Node.js and npm, Jenkins installs dependencies, builds the React UI - library, and runs unit tests.
- Publishing: After a successful build, the library is published to the npm registry with public access.
- Cleanup: Jenkins cleans up after publishing to keep the environment secure.

## This CI/CD pipeline helps in:
- Ensuring smooth integration and delivery of updates
- Preventing issues like broken dependencies and version mismatches
- Minimizing the time spent on manual tasks
- Providing transparency and consistency in the release process

## Quick Start Guide:
- Created a linux Redhat Machine in AWS.
![AWS machine](https://github.com/user-attachments/assets/6d051eaa-1ece-4e43-bd0f-6664fcaac08d)

- Configured a vpc with 2 subnets with routetable associated with internet gateway.
![VPC with public subnet and routetable associated with IGW](https://github.com/user-attachments/assets/2d10a3df-7e3b-425e-acd8-e9919a132a4d)

## Accessed the machine and start to install Required Tools and Dependencies
Step 1: Set Up a React UI Library with TypeScript
1- Install Node.js and npm on RedHat:
Since we need Node.js 18.6.0, install it using these commands:
```
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -
sudo yum install -y nodejs
node -v
```
2- Create a React UI Library Project:
Initialize a TypeScript-based React project:
```
npx create-react-app my-ui-library --template typescript
cd my-ui-library
```

### Part 2: Setting Up Jenkins for CI/CD
Install and Configure Jenkins on RedHat:
Install Jenkins:
 Install Java Development Kit
```
sudo dnf install java-17-openjdk -y
```
Verify the Java version, execute below command
```
java --version
```

Add Jenkins Repository
```
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
```
Install Jenkins
```
sudo yum install Jenkins -y
```
Run below command to reload the Jenkins daemon
```
sudo systemctl daemon-reload
```
Start and enable Jenkins service using following commands and it must me running
```
sudo systemctl start Jenkins
sudo systemctl status jenkins
```
Configure Firewall
  ```
sudo firewall-cmd --add-port=8080/tcp --permanent
sudo firewall-cmd --reload
  ```

Access Jenkins Web Interface
```
http://your_server_ip:8080
```
![start jenkins](https://github.com/user-attachments/assets/d6daad4d-4c86-4699-aacc-7f74d3c40266)

Copy the password and paste it into the Jenkins web interface and then click on Continue.
```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Install Recommended Plugins
![Install-Suggested-Jenkins-Plugins-RHEL9-RockyLinux9-1024x556](https://github.com/user-attachments/assets/fbc56f92-21d1-4ff2-8bc2-10e6f306789b)

![create fisrt admin](https://github.com/user-attachments/assets/c3a45757-1d39-426e-9bb3-87e91c610f36)

## Configure GitHub Credentials in Jenkins
Create GitHub Credentials:

In Jenkins, go to Manage Jenkins > Manage Credentials.
Add a new credential for GitHub, selecting Username and Password.
Enter your GitHub username and create a personal access token with the required permissions (GitHub token instructions).

- Create a Jenkins Pipeline
- Create the Jenkins Pipeline Job
- Create a new item in Jenkins:

- From your Jenkins dashboard, click New Item.
- Select Pipeline, name your project (Ezzat-SiemensTask), and click OK.

> [!NOTE]
>  You need to create a classic token from your github first to include it in jenkins ( https://github.com/settings/tokens ).

![Screenshot (84)](https://github.com/user-attachments/assets/a6d9ce70-3566-4700-9f4b-90b1ee48bc3a)

### Configure Pipeline:
Scroll down to the Pipeline section and choose Pipeline script from SCM.
Select Git and paste the URL of your GitHub repository.
Under Credentials, select the GitHub credentials you created earlier.
Set the Branch Specifier to */master or whichever branch you are working on.

![Screenshot (85)](https://github.com/user-attachments/assets/1ddcec53-9adc-432d-af7d-02957da80392)

Create a Jenkinsfile in the GitHub Repo
In the root of your project (inside your GitHub repo), create a Jenkinsfile:

```
vim Jenkinsfile
```
add the following pipelinecode to jenkins file: 
```
pipeline {
  agent any
  
  environment {
    NPM_CREDENTIALS = credentials('NPM-cred-Token-Secret')
  }

  stages {
    stage('Install Dependencies') {
      steps {
        script {
          nodejs('Node 18.6.0') {
            sh 'npm install'
            sh 'npm install --save-dev @babel/plugin-proposal-private-property-in-object'
          }
        }
      }
    }

    stage('Build') {
      steps {
        script {
          sh 'npm run build'
        }
      }
    }

    stage('Publish to npm Registry') {
      steps {
        script {
          withCredentials([string(credentialsId: 'NPM-cred-Token-Secret', variable: 'NPM_TOKEN')]) {
            sh """
              # Create .npmrc with token for npm publish
              echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
              # Publish the package to npm with public access
              npm publish --access public || { echo "publish failed"; exit 1; }
              # Clean up .npmrc
              rm -f ~/.npmrc
            """
          }
        }
      }
    }
  }

  post {
    success {
      echo 'NPM package published successfully!'
    }
    failure {
      echo 'Failed to publish NPM package.'
    }
  }
}
```
Commit and Push the Jenkinsfile to GitHub:
```
git add Jenkinsfile
git commit -m "Add Jenkinsfile for CI/CD"
git push origin master
```

## created NPM account and created a token to include it in the Jenkins file
and then created a new creditials with secret text in jenkins to include rpm. 
![Screenshot (86)](https://github.com/user-attachments/assets/d68fa43f-2ad8-417d-b0c6-7847b26fdb9e)



 - Go back to the server where jenkins is installed and make some configurations
- Edit package.json, In npm, a package marked as private cannot be published:
```
sudo vim package.json
```
- Locate the "private": true field in your package.json file and either:
Set it to "private": false.

> [!NOTE]
>  Don’t forget to Push the Changes to your github repo after the changes.
```
git add 
git commit
git push origin main
```
- After that we need to authanticate our npm to our jenkins server.
Run the following command in the jenkins server.
```
npm login --auth-type=legacy
```
ou will be prompted to enter your npm username, password, and email. Make sure to use the credentials associated with your npm account.
- Then an otp will be sent to you email to authanticate npm with the server
![Screenshot (83)](https://github.com/user-attachments/assets/c85424d4-b6d9-44c5-9bc2-f82960da5193)

### Try to run your pipeline:
it works 
![Screenshot (68)](https://github.com/user-attachments/assets/b226dfc9-4b5b-4bee-b492-2068b93c0712)

![Screenshot (69)](https://github.com/user-attachments/assets/04e25627-1011-444e-9a99-fafb5b1f527e)

![Screenshot (71)](https://github.com/user-attachments/assets/18d19486-1d35-4c31-a885-6d20272e24eb)
![Screenshot (72)](https://github.com/user-attachments/assets/6c27faa0-585a-4cd3-b366-9f74bb1900ce)
![Screenshot (73)](https://github.com/user-attachments/assets/c89ca507-4de4-4099-a266-7f9059af1af9)
![Screenshot (74)](https://github.com/user-attachments/assets/067edcc0-8ecd-4daa-bede-46e351dfb47d)
![Screenshot (75)](https://github.com/user-attachments/assets/e1442b46-9dc8-4751-8e68-b40a705f2a15)
![Screenshot (76)](https://github.com/user-attachments/assets/32957d9d-acd4-4d9c-9ed2-07792745709c)
![Screenshot (77)](https://github.com/user-attachments/assets/6f445d05-ca84-4c1a-b8e0-4487ce7550c4)

### MY Library is successfully published
![Screenshot (79)](https://github.com/user-attachments/assets/3aaf7034-f1d1-4466-90c3-481c2ac14d12)
![Screenshot (80)](https://github.com/user-attachments/assets/0ab3d18a-48a6-41bc-adb4-c24e73700639)


## Challenges Faced
During the setup of the Jenkins pipeline, several challenges were encountered:

1- Credential Management:
- Initially, the wrong credential type was used (Username with password instead of Secret text), leading to authentication errors during the publish stage. This was resolved by creating a Secret text credential in Jenkins and updating the Jenkinsfile accordingly.

2- NPM Authentication Issues:
- Encountered multiple errors related to authentication when publishing the package, including E404 Not Found and ENEEDAUTH. These issues were resolved by properly configuring the .npmrc file with the correct authentication token.

3- Dependency Management:
- While installing dependencies, warnings about deprecated packages and vulnerabilities were displayed. It was necessary to review these warnings and ensure that the project was using the most current and secure packages.

## Conclusion
This setup automates the entire lifecycle of the React UI library, from code updates to build, testing, and deployment. Using Jenkins for CI/CD ensures that developers can easily maintain the UI library, avoid missing updates, and keep dependencies intact while syncing with other projects.
