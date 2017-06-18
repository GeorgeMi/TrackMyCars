/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */

using AzureDataAccess.Context;
using AzureDataAccess.Repository.Interfaces;
using Entities;

namespace AzureDataAccess.Repository.Implemenations
{
    /// <summary>
    /// Repository implementare interfata "IUserRepository"
    /// </summary>
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        /// <summary>
        /// Constructor
        /// </summary>
        public UserRepository(TrackMyCarsContext context) : base(context)
        {
        }

        /// <summary>
        /// Schimbare rol utilizator
        /// </summary>
        /// <param name="userID">utilizatorul</param>
        /// <param name="role">noul rol</param>
        public void ChangeRole(int userID, string role)
        {
            User u = Context.Users.Find(userID);
            u.Role = role;
            Context.SaveChanges();
        }

        /// <summary>
        /// Stergere utilizatori care nu au conturile verificate
        /// </summary>
        public void ScheduleDeleteUsers()
        {
            Context.Database.ExecuteSqlCommand("delete from [dbo].[User] where Verified = 'no'");
        }

        /// <summary>
        /// Validare cont utilizator
        /// </summary>
        /// <param name="userID">utilizator</param>
        public void Verified(int userID)
        {
            User u = Context.Users.Find(userID);
            u.Verified = "yes";
            Context.SaveChanges();
        }
    }
}
