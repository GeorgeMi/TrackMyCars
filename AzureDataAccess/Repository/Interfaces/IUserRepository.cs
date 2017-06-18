/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 *
 * History:
 * 09.02.2016    Miron George       Created interface.
 */
using Entities;

namespace AzureDataAccess.Repository.Interfaces
{
    /// <summary>
    /// Interfata repository "User"
    /// </summary>
    public interface IUserRepository : IGenericRepository<User>
    {
        void ChangeRole(int userID, string role);
        void ScheduleDeleteUsers();
        void Verified(int userID);
    }
}
