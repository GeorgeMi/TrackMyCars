/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 *
 *
 * History:
 * 09.02.2016    Miron George       Created interface.
 */
using AzureDataAccess.Repository.Interfaces;

namespace AzureDataAccess
{
    /// <summary>
    /// Interfata nivelului de date
    /// </summary>
    public interface IAzureDataAccess
    {
        ICarRepository CarRepository { get; set; }
        ICarsUtilityRepository CarsUtilityRepository { get; set; }
        IDriverCarRepository DriverCarRepository { get; set; }
        IUserRepository UserRepository { get; set; }
        ITokenRepository TokenRepository { get; set; }
        IUtilityRepository UtilityRepository { get; set; }
    }
}
