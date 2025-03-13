import crypto from 'crypto'
import fs from 'fs'
import { format } from 'path'

const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    }
})

fs.writeFileSync('keys/private.pem', privateKey)
fs.writeFileSync('keys/public.pem', publicKey)