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
                # Stop and remove the existing frontend container if it exists
                docker ps -q --filter "name=frontend" | grep -q . && docker stop frontend && docker rm frontend || true

                # Run the new frontend container
                docker run -d --name frontend --rm -p 3000:3000 ${FRONTEND_IMAGE}:latest
                '''
            }
        }
    }
}
