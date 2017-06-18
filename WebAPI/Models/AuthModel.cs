/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */
using Microsoft.Practices.Unity;

namespace WebAPI.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class AuthModel
    {
        private BusinessLogic.BusinessLogic bl;

        /// <summary>
        /// Constructor. Initializeaza Unity container si injecteaza dependenta in BLL si DAL 
        /// </summary>
        public AuthModel()
        {
            IUnityContainer objContainer = new UnityContainer();
            objContainer.RegisterType<BusinessLogic.BusinessLogic>();
            objContainer.RegisterType<AzureDataAccess.IAzureDataAccess, AzureDataAccess.AzureDataAccess>();
            bl = objContainer.Resolve<BusinessLogic.BusinessLogic>();
        }

        /// <summary>
        /// Cere BLL sa valideze user si parola si sa intoarca token-ul
        /// </summary>
        /// <param name="username">username</param>
        /// <param name="password">password</param>
        /// <returns>tokenul actualizat</returns>
        public string Authenticate(string username, string password)
        {
            return bl.AuthLogic.Authenticate(username, password);
        }

        /// <summary>
        ///  Cere BLL sa returneze rolul utilizatorului
        /// </summary>
        /// <param name="username">username</param>
        /// <returns>rolul utilizatorului</returns>
        public string GetRole(string username)
        {
            return bl.UserLogic.GetUserRole(username);
        }

        /// <summary>
        /// Cere BLL sa verifice daca exista un anumit token
        /// </summary>
        /// <param name="token">token string</param>
        /// <returns>true sau false</returns>
        public bool VerifyToken(string token)
        {
            return bl.AuthLogic.VerifyTokenDate(token);
        }

        /// <summary>
        /// Cere BLL sa verifice daca tokenul apartine unui admin
        /// </summary>
        /// <param name="token">token string</param>
        /// <returns>true sau false</returns>
        public bool VerifyAdminToken(string token)
        {
            return bl.AuthLogic.VerifyAdminToken(token);
        }

        /// <summary>
        ///  Cere BLL sa verifice tokenul trimis prin mail
        /// </summary>
        /// <param name="token">token string</param>
        /// <returns>true sau false</returns>
        public bool VerifyMailToken(string token)
        {
            return bl.AuthLogic.VerifyMailToken(token);
        }
    }
}