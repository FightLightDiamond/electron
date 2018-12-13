import { ethers } from 'ethers';
export class Auth
{
    createWallet(privateKey) {
        let provider = ethers.getDefaultProvider();
        return new ethers.Wallet(privateKey, provider);
    }
    
}