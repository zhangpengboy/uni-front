import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMRAJi8jlkjl+lMmRF0su6lWtYies15b\n' +
  'keowIvEJz2xANywXRaZwKPzdvQImObXN2sfsXmvCTGQh2jzLIYFznD8CAwEAAQ=='

const privateKey = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAxEAmLyOWSOX6UyZE\n' +
  'XSy7qVa1iJ6zXluR6jAi8QnPbEA3LBdFpnAo/N29AiY5tc3ax+xea8JMZCHaPMsh\n' +
  'gXOcPwIDAQABAkAjGf46bDkTLN9LRAryR3ABZ9rsZsZaWDKPGrEFP+XzzHBipbQt\n' +
  'MeNJ99RoybAbIuAbYqvLnNhXFJZ8ld9fEARBAiEA4dktHC8LRLSxZhB8d1h4mqXp\n' +
  'vXzMtjvnWuQM82frfrECIQDec2jbAATrXGpmCxT4dt0QTJRyD2YEJDCXhNmy0YTl\n' +
  '7wIgbPL2dvUey3sbZPApCu2r6HaHJnjQzExjlA4VTUphaVECIEdjcjsV/n4p4ltt\n' +
  'IwW536fja6BPIMYjdxSpJdQlOSkxAiEAtCoL+aPCsLP92HqXYSjnjTzv06BZ/Tdn\n' +
  '5uBLrJXMyUA='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

