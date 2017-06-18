/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 *
 * Role:
 * Repository implementation. 
 *
 * History:
 * 09.02.2016    Miron George       Created class.
 */

using System;
using AzureDataAccess.Context;
using AzureDataAccess.Repository.Interfaces;
using Entities;

namespace AzureDataAccess.Repository.Implemenations
{
    public class TokenRepository : GenericRepository<Token>, ITokenRepository
    {
        public TokenRepository(TrackMyCarsContext context) : base(context)
        {
        }
        public void UpdateExpirationDate(int id,DateTime expirationDate)
        {
            var t = Context.Tokens.Find(id);
            t.ExpirationDate = expirationDate;

            Context.SaveChanges();
        }
        public void UpdateToken(int id, DateTime createdDate, DateTime expirationDate, string tokenString)
        {
            var t = Context.Tokens.Find(id);

            t.CreatedDate = createdDate;
            t.ExpirationDate = expirationDate;
            t.TokenString = tokenString;
            
            Context.SaveChanges();
        }
    }
}
