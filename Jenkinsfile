pipeline {
    agent any
    environment {
        FRONTEND_IMAGE = "shreyash2811/frontend"
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'deploy', url: 'https://github.com/aniketd-11/Hackathon_GoalTracker.git'
            }
        }
        stage('Build and Push Frontend Image') {
            steps {
                sh '''
                cd frontend
                # Build the Next.js application
                docker build -t ${FRONTEND_IMAGE}:latest .
                docker push ${FRONTEND_IMAGE}:latest
                '''
            }
        }
        stage('Deploy Frontend') {
            steps {
                sh '''
                docker stop frontend || true
                docker run -d --name frontend --rm -p 3000:3000 ${FRONTEND_IMAGE}:latest
                '''
            }
        }
    }
}
