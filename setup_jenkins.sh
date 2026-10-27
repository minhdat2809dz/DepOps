#!/bin/bash
set -e

export DEBIAN_FRONTEND=noninteractive

echo "=== 1. Checking Swapfile ==="
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swapfile created (2GB)."
else
    echo "Swapfile already exists."
fi

echo "=== 2. Installing Jenkins ==="
sudo apt-get install -y jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

echo "=== 3. Installing Docker & Docker Compose ==="
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
ARCH=$(dpkg --print-architecture)
CODENAME=$(lsb_release -cs)
echo "deb [arch=${ARCH} signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${CODENAME} stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "=== 4. Granting Docker permissions ==="
sudo usermod -aG docker ubuntu
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

echo "=== 5. Checking Services Status ==="
sudo systemctl is-active --quiet jenkins && echo "Jenkins: RUNNING" || echo "Jenkins: FAILED"
sudo systemctl is-active --quiet docker && echo "Docker: RUNNING" || echo "Docker: FAILED"

echo "=== 6. Waiting for initial admin password ==="
for i in {1..30}; do
    if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
        break
    fi
    sleep 2
done

if [ -f /var/lib/jenkins/secrets/initialAdminPassword ]; then
    echo "INITIAL_ADMIN_PASSWORD_BEGIN"
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    echo "INITIAL_ADMIN_PASSWORD_END"
fi
