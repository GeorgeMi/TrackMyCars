/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 *
 * Role:
 *  User logic. 
 *
 * History:
 * 10.02.2016    Miron George       Created class.
 */

using AzureDataAccess;
using DataTransferObject;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;

namespace BusinessLogic
{

    /// <summary>
    /// Logica gestionarii utilizatorilor
    /// </summary>
    public class UserLogic
    {
        private readonly IAzureDataAccess _dataAccess;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objDataAccess"></param>
        public UserLogic(IAzureDataAccess objDataAccess)
        {
            _dataAccess = objDataAccess;
        }

        /// <summary>
        /// Returnarea listei tuturor utilizatorilor
        /// </summary>
        /// <param name="page"></param>
        /// <param name="perPage"></param>
        /// <returns></returns>
        public List<UserDetailDTO> GetAllUsers(int page, int perPage)
        {
            var userList = _dataAccess.UserRepository.GetAll().ToList();
            userList = userList.Skip(page*perPage).Take(perPage).ToList();
            var userDtoList = new List<UserDetailDTO>();

            foreach (var u in userList)
            {
                var userDto = new UserDetailDTO
                {
                    Email = u.Email,
                    Password = u.Password,
                    Role = u.Role,
                    Username = u.Username,
                    UserID = u.UserID
                };

                userDtoList.Add(userDto);
            }

            return userDtoList.ToList();
        }

        /// <summary>
        /// Returnare rol utilizator
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public string GetUserRole(string username)
        {
            return _dataAccess.UserRepository.FindFirstBy(u => u.Username.Equals(username)).Role;
        }

        /// <summary>
        /// Adaugare utilizator
        /// </summary>
        /// <param name="userDto"></param>
        /// <returns></returns>
        public int AddUser(UserRegistrationDTO userDto)
        {
            if (string.IsNullOrWhiteSpace(userDto.Username) || string.IsNullOrWhiteSpace(userDto.Password) ||
                string.IsNullOrWhiteSpace(userDto.Email))
            {
                throw new System.Exception("failed");
            }

            // Adauga un user
            MD5 md5 = new MD5CryptoServiceProvider();
            var textToHash = Encoding.Default.GetBytes(userDto.Password);
            var result = md5.ComputeHash(textToHash);
            var passHash = BitConverter.ToString(result);

            var user = new User
            {
                Username = userDto.Username,
                Password = passHash,
                Email = userDto.Email,
                Role = "user",
                Verified = "no"
            };

            _dataAccess.UserRepository.Add(user);

            return _dataAccess.UserRepository.FindFirstBy(u => u.Username.Equals(userDto.Username)).UserID;
        }

        /// <summary>
        /// Returnarea listei cu toti userii si id-urile asociate
        /// </summary>
        /// <returns></returns>
        public List<UsernameDTO> GetAllUsernames()
        {
            var userList = _dataAccess.UserRepository.GetAll().ToList();
            var userDtoList = new List<UsernameDTO>();

            foreach (var u in userList)
            {
                var userDto = new UsernameDTO
                {
                    Username = u.Username,
                    UserID = u.UserID
                };

                userDtoList.Add(userDto);
            }

            return userDtoList.ToList();
        }

        /// <summary>
        /// Cautare user dupa id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public UserDetailDTO GetUser(int id)
        {
            var user = _dataAccess.UserRepository.FindFirstBy(u => u.UserID == id);
            var userDto = new UserDetailDTO
            {
                Username = user.Username,
                Password = user.Password,
                Email = user.Email,
                Role = user.Role,
                UserID = user.UserID
            };

            return userDto;
        }

        /// <summary>
        /// Stergere utilizator
        /// </summary>
        /// <param name="id"></param>
        public void DeleteUser(int id)
        {
            // Sterge user dupa id, dar care difera de contul de admin "Admin" care nu poate fi sters niciodata
            var u = _dataAccess.UserRepository.FindFirstBy(user => user.UserID == id && user.Username != "Admin");
            if (null == u)
            {
                throw new Exception("'Admin' cannot be deleted");
            }
            _dataAccess.UserRepository.Delete(u);
        }

        /// <summary>
        /// Stergere utilizator
        /// </summary>
        /// <param name="userDto"></param>
        public void DeleteUser(UserDetailDTO userDto)
        {
            if (userDto.Username == "Admin")
            {
                throw new Exception("'Admin' cannot be deleted");
            }

            var user = new User
            {
                Username = userDto.Username,
                Password = userDto.Password,
                Email = userDto.Email,
                Role = userDto.Role
            };

            _dataAccess.UserRepository.Delete(user);
        }

        /// <summary>
        /// Cautare id user
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public int GetUserId(string username)
        {
            return _dataAccess.UserRepository.FindFirstBy(user => user.Username.Equals(username)).UserID;
        }

        /// <summary>
        /// Cautare nume user
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public string GetUsername(int id)
        {
            return _dataAccess.UserRepository.FindFirstBy(user => user.UserID == id).Username;
        }

        /// <summary>
        /// Promovare utilizator
        /// </summary>
        /// <param name="id"></param>
        public void PromoteUser(int id)
        {
            // User devine admin
            _dataAccess.UserRepository.FindFirstBy(user => user.UserID == id);
            _dataAccess.UserRepository.ChangeRole(id, "admin");
        }

        public void DemoteUser(int id)
        {
            // Admin devine user
            var u = _dataAccess.UserRepository.FindFirstBy(user => user.UserID == id && user.Username != "Admin");
            if (null == u)
            {
                throw new Exception("'Admin' cannot be demote");
            }
            _dataAccess.UserRepository.ChangeRole(id, "user");
        }

        /// <summary>
        /// Trimitere mail de confirmare
        /// </summary>
        /// <param name="token"></param>
        /// <param name="username"></param>
        /// <param name="email"></param>
        public void SendAuthEmail(string token, string username, string email)
        {
            var mail = new MailMessage();
            var smtpServer = new SmtpClient("smtp.gmail.com");
            mail.From = new MailAddress("votemypoll@gmail.com");
            mail.To.Add(email);
            mail.Subject = "Welcome to TrackMyCars";
            mail.Body = "<h3>Hello " + username + ", </h3>";
            mail.Body +=
                "<p>Thanks for signing up! Before you start, please verify your email address by clicking <a href=\"http://trackmycars.azurewebsites.net/#/?verifymail=" +
                token + "\">here</a>.</p>";
            mail.Body += "<p>This link will expire in 24 hours if it's not activated.</p>";
            mail.Body += "<h5>The TrackMyCars team</h5>";
            mail.IsBodyHtml = true;

            smtpServer.Port = 587;
            smtpServer.Credentials = new System.Net.NetworkCredential("votemypoll@gmail.com", "votemypollteam1234");
            smtpServer.EnableSsl = true;

            smtpServer.Send(mail);
        }

        /// <summary>
        /// Actualizare conturi si sondaje
        /// </summary>
        public void ScheduledJobs()
        {
            _dataAccess.UserRepository.ScheduleDeleteUsers();
        }
    }
}
