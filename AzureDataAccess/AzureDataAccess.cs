/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 *
 *
 * History:
 * 09.02.2016    Miron George       Created class.
 */
using AzureDataAccess.Repository.Interfaces;
using AzureDataAccess.Context;
using AzureDataAccess.Repository.Implemenations;

namespace AzureDataAccess
{
    /// <summary>
    /// Implementarea nivelului de date
    /// </summary>
    public class AzureDataAccess : IAzureDataAccess
    {
        public ICarRepository CarRepository { get; set; }
        public ICarsUtilityRepository CarsUtilityRepository { get; set; }
        public IDriverCarRepository DriverCarRepository { get; set; }
        public IUserRepository UserRepository { get; set; }
        public ITokenRepository TokenRepository { get; set; }
        public IUtilityRepository UtilityRepository { get; set; }
      
        /// <summary>
        /// Constructor
        /// </summary>
        public AzureDataAccess()
        {
            var context = new TrackMyCarsContext();
            CarRepository = new CarRepository(context);
            CarsUtilityRepository = new CarsUtilityRepository(context);
            DriverCarRepository = new DriverCarRepository(context);
            UserRepository = new UserRepository(context);
            TokenRepository = new TokenRepository(context);
            UtilityRepository = new UtilityRepository(context);
        }
    }
}
