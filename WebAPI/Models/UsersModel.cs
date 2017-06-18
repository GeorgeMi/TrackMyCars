/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */
using DataTransferObject;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public class UsersModel
    {
        /// <summary>
        /// Modelul pentru gestionarea utilizatorilor
        /// </summary>
        private readonly BusinessLogic.BusinessLogic _bl;

        /// <summary>
        /// Constructor. Initializeaza Unity container si injecteaza dependenta in BLL si DAL 
        /// </summary>
        public UsersModel()
        {
            IUnityContainer objContainer = new UnityContainer();
            objContainer.RegisterType<BusinessLogic.BusinessLogic>();
            objContainer.RegisterType<AzureDataAccess.IAzureDataAccess, AzureDataAccess.AzureDataAccess>();
            _bl = objContainer.Resolve<BusinessLogic.BusinessLogic>();
        }

        /// <summary>
        /// Cere BLL sa adauge un nou utilizator 
        /// </summary>
        /// <param name="userDto">user's details</param>
        public bool AddUser(UserRegistrationDTO userDto)
        {
            try
            {
                var id = _bl.UserLogic.AddUser(userDto);
                // Creare token
                var token = _bl.TokenLogic.UpdateToken(id, userDto.Username, userDto.Password);
                // Trimitere mai verificare
                _bl.UserLogic.SendAuthEmail(token, userDto.Username, userDto.Email);

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        /// <summary>
        /// Cere BLL sa returneze toate id-urile si username-urile utilizatorilor 
        /// </summary>
        public List<UsernameDTO> GetAllUsernames()
        {
            try
            {
                return _bl.UserLogic.GetAllUsernames();
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Cere BLL sa returneze id-ul utilizatorului
        /// </summary>
        /// <param name="username">username</param>
        public int GetUserId(string username)
        {
            return _bl.UserLogic.GetUserId(username);
        }

        public bool PromoteUser(int id)
        {
            // Avanseaza user la rol de admin
            try
            {
                _bl.UserLogic.PromoteUser(id);
                return true;
            }
            catch
            {
                return false;
            }

        }

        public bool DemoteUser(int id)
        {
            // Retrogradeaza user la rol de user
            try
            {
                _bl.UserLogic.DemoteUser(id);
                return true;
            }
            catch
            {
                return false;
            }
        }
        public List<UserDetailDTO> GetAllUsers(int pageNr,int perPage)
        {
            try
            {
                return _bl.UserLogic.GetAllUsers(pageNr, perPage);
            }
            catch
            {
                return null;
            }
        }

        public UserDetailDTO GetUser(int id)
        {
            try
            {
                return _bl.UserLogic.GetUser(id);
            }
            catch
            {
                return null;
            }
        }

        public bool Delete(int userId)
        {
            try
            {
                _bl.UserLogic.DeleteUser(userId);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public void ScheduleUpdates()
        {
            _bl.UserLogic.ScheduledJobs();
        }
    }
}