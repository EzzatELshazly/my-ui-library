pipeline {
  agent any
  environment {
      NPM_CREDENTIALS = credentials('NPM-cred-Token')
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

    // Remove the Lint stage if it's not necessary

    stage('Test') {
      steps {
        script {
          sh 'npm run test'
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
          sh """
          echo '//registry.npmjs.org/:_authToken=${NPM_CREDENTIALS}' > ~/.npmrc
          """
          sh 'npm publish'
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
