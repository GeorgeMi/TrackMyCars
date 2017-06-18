﻿namespace WebAPI.Messages
{
    public class TokenMessage 
    {
        public string token;
        public string role;

        public TokenMessage(string token,string role)
        {
            this.token = token;
            this.role = role;
        }
    }
}