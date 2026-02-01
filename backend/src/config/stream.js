import {StreamChat} from 'stream-chat';
import {ENV} from '../config/env.js';

const streamClient=StreamChat.getInstance(ENV.STREAM_API_KEY,ENV.STREAM_API_SECRET);

export const upsertStreamUser=async(userData)=>{
    try {
        await streamClient.upsertUser(userData);
        console.log("Stream user upserted:",userData.id);
        return userData;    
    } catch (error) {
        
    }
}

export const deleteStreamUser=async(userId)=>{
    try {
        await streamClient.deleteUser(userId);
        console.log("Stream user Deleted:",userId);
        return userData;    
    } catch (error) {
        console.error("Error deleting Stream user:",error);
    }
}

export const generateStreamToken=(userId)=>{
    try {
        const userIdString=userId.toString();
        const token=streamClient.createToken(userIdString);
        return token;
    } catch (error) {
        console.error("Error generating Stream token:",error);
        return null;
    }
}
