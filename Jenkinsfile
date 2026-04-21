pipeline {
    agent any

    environment {
        APP_DIR = "/home/ubuntu/var/www/awsproject"
        APP_NAME = "awsproject"
        BRANCH = "main"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${BRANCH}",
                    url: 'https://github.com/sanoj-chaudhary/awsproject.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

       stage('Deploy') {
    steps {
        sh '''
            cd $APP_DIR

            git pull origin $BRANCH

            npm ci

            sudo -u ubuntu /usr/bin/pm2 restart awsproject --update-env || \
            sudo -u ubuntu /usr/bin/pm2 start app.js --name awsproject

            sudo -u ubuntu /usr/bin/pm2 save
        '''
    }
}

    }

    post {
        success {
            echo 'Deployment successful'
        }

        failure {
            echo 'Deployment failed'
        }
    }
}