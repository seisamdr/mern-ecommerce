npx prisma migrate dev --name init
npx prisma studio

install pm2 on VPS with aapanel terminal

1.  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs

2.  sudo npm install -g pm2

3.  ln -s $(find / -name pm2 -type f 2>/dev/null | grep "/bin/pm2$" | head -n 1) /usr/bin/pm2
4.  pm2 --version

postman docs live API
https://documenter.getpostman.com/view/26950655/2sB3BGGUe3
