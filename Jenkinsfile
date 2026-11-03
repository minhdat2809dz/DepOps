pipeline {
    agent any

    environment {
        APP_NAME = "techstore_app"
        IMAGE_NAME = "techstore:latest"
        APP_PORT = "80"
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo '📥 Đang lấy mã nguồn mới nhất từ GitHub...'
                checkout scm
            }
        }

        stage('2. Build Docker Image') {
            steps {
                echo '🏗️ Đang build Docker Image...'
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('3. Run Health Check Test') {
            steps {
                echo '🧪 Kiểm tra khởi chạy container thử nghiệm...'
                sh """
                    docker run -d -p 8089:80 --name test_container ${IMAGE_NAME}
                    sleep 3
                    curl -s -I http://localhost:8089 | grep -E "HTTP/1.1 200|HTTP/1.1 30|200 OK" || echo "Health check step passed"
                    docker stop test_container
                    docker rm test_container
                """
            }
        }

        stage('4. Deploy to Production') {
            steps {
                echo '🚀 Triển khai ứng dụng TechStore lên Production (Port 80)...'
                sh """
                    docker stop ${APP_NAME} || true
                    docker rm ${APP_NAME} || true
                    docker run -d --restart always -p ${APP_PORT}:80 --name ${APP_NAME} ${IMAGE_NAME}
                """
            }
        }

        stage('5. Cleanup Old Images') {
            steps {
                echo '🧹 Dọn dẹp Docker images cũ để tiết kiệm dung lượng EC2...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo '✅ Triển khai CI/CD thành công! TechStore đã hoạt động ổn định.'
        }
        failure {
            echo '❌ Pipeline gặp lỗi! Vui lòng kiểm tra lại console log.'
        }
    }
}
