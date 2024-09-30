pipeline {
  agent any
  environment {
      // Define npm credentials from Jenkins credentials store
      NPM_CREDENTIALS = credentials('NPM-cred-Token')
  }

  stages {
    stage('Install Dependencies') {
      steps {
        script {
          nodejs('Node 18.6.0') {
            // Install dependencies
            sh 'npm install'
            // Install missing Babel plugin manually
            sh 'npm install --save-dev @babel/plugin-proposal-private-property-in-object'
          }
        }
      }
    }

    stage('Lint') {
      steps {
        script {
          // Run linter
          sh 'npm run lint'
        }
      }
    }

    stage('Test') {
      steps {
        script {
          // Run tests
          sh 'npm run test'
        }
      }
    }

    stage('Build') {
      steps {
        script {
          // Build project
          sh 'npm run build'
        }
      }
    }

    stage('Publish to npm Registry') {
      steps {
        script {
          // Write npm credentials to a temporary .npmrc file
          sh """
          echo '//registry.npmjs.org/:_authToken=${NPM_CREDENTIALS}' > ~/.npmrc
          """

          // Publish to npm registry
          sh 'npm publish'

          // Cleanup .npmrc
          sh 'rm -f ~/.npmrc'
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





