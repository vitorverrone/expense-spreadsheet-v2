# Usa uma imagem oficial do Node.js como base
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /

# Copia os arquivos de dependências para o container
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante da aplicação para o container
COPY . .

# Expõe a porta que o app usa (ajuste se necessário)
EXPOSE 3005

# Comando para rodar o servidor
CMD ["npm", "start"]