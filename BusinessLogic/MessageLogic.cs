/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */

using System;
using System.Collections.Generic;
using AzureDataAccess;
using DataTransferObject;
using System.Linq;
using System.Net.Mail;
using Entities;

namespace BusinessLogic
{
    /// <summary>
    /// Logica gestionarii mesajelor
    /// </summary>
    public class MessageLogic
    {
        private readonly IAzureDataAccess _dataAccess;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="objDataAccess"></param>
        public MessageLogic(IAzureDataAccess objDataAccess)
        {
            // Primesc obiectul, nu e treaba UserLogic ce dataAccess se foloseste
            // Unity are grija de dependency injection
            _dataAccess = objDataAccess;
        }

        /// <summary>
        /// Trimitere mesaj
        /// </summary>
        /// <param name="token"></param>
        /// <param name="contactMessageDto"></param>
        public void SendMessage(string token, ContactMessageDTO contactMessageDto)
        {
            if (string.IsNullOrWhiteSpace(contactMessageDto.Category) || string.IsNullOrWhiteSpace(contactMessageDto.Message) || contactMessageDto.Receiver < 0)
                throw new System.Exception("Values cannot be null");

            var userId = _dataAccess.TokenRepository.FindFirstBy(t => t.TokenString.Equals(token)).UserID;
            var username = _dataAccess.UserRepository.FindFirstBy(u => u.UserID == userId).Username;

            var mail = new MailMessage();
            var smtpServer = new SmtpClient("smtp.gmail.com");

            mail.From = new MailAddress("votemypoll@gmail.com");
            mail.Subject = contactMessageDto.Category + " from " + username;
            mail.Body = "<p>" + contactMessageDto.Message + "</p>";
            mail.IsBodyHtml = true;

            if (contactMessageDto.Receiver == 0)
            {
                var adminsList = _dataAccess.UserRepository.FindAllBy(user => user.Role.Equals("admin")).ToList();
                foreach (var admin in adminsList)
                {
                    mail.Bcc.Add(new MailAddress(admin.Email));
                }
            }
            else
            {
                var receiver = _dataAccess.UserRepository.FindFirstBy(user => user.UserID == contactMessageDto.Receiver);
                mail.To.Add(new MailAddress(receiver.Email));
                mail.Bcc.Add(new MailAddress("george.miron2003@gmail.com"));
            }

            smtpServer.Port = 587;
            smtpServer.Credentials = new System.Net.NetworkCredential("votemypoll@gmail.com", "votemypollteam1234");
            smtpServer.EnableSsl = true;

            smtpServer.Send(mail);
        }

        /// <summary>
        /// 
        /// </summary>
        public void UpdateUsers()
        {
            var listCars = new List<CarsUtility>();
            foreach (var car in _dataAccess.CarsUtilityRepository.GetAll())
            {
                int months;
                if (car.Utility.MonthsNo == null)
                {
                    months = 0;
                }
                else
                {
                    months = (int)car.Utility.MonthsNo;
                }

                int km;
                if (car.Utility.KmNo == null)
                {
                    km = 0;
                }
                else
                {
                    km = (int)car.Utility.KmNo;
                }

                var carUtilityList = _dataAccess.CarsUtilityRepository.FindAllBy(d => d.StartedDate.AddMonths(months).Subtract(DateTime.Today).Days <= 10 || (car.StartedKmNo + km - car.Car.KmNo) < 100).ToList();

                //foreach (var carUtility in carUtilityList)
                //{
                //    carUtility.Car.DriversCars.
                //}
            }
            var result = new List<CarDTO>();

            foreach (var c in listCars)
            {
                var utilities = _dataAccess.CarsUtilityRepository.FindAllBy(u => u.CarID == c.CarID).ToList();
                var list = new List<CarUtilityDetailsDTO>();

                foreach (var u in utilities)
                {
                    int months;
                    if (u.Utility.MonthsNo == null)
                    {
                        months = 0;
                    }
                    else
                    {
                        months = (int)u.Utility.MonthsNo;
                    }

                    int km;
                    if (u.Utility.KmNo == null)
                    {
                        km = 0;
                    }
                    else
                    {
                        km = (int)u.Utility.KmNo;
                    }

                    var expirationDate = u.StartedDate.AddMonths(months).Subtract(DateTime.Today).Days;
                    var kmNo = u.StartedKmNo + km - u.Car.KmNo;

                    list.Add(new CarUtilityDetailsDTO
                    {
                        UtilityName = u.Utility.UtilityName,
                        ExpirationDate = expirationDate >= 0 ? expirationDate : 0,
                        ExpirationKmNo = kmNo >= 0 ? kmNo : 0,

                    });
                }

                var obj = new CarDTO
                {
                    CarID = c.CarID,
                    Brand = c.Brand,
                    KmNo = c.KmNo,
                    RegNo = c.RegNo,
                    Year = c.Year,
                    Driver = _dataAccess.DriverCarRepository.FindFirstBy(d => d.CarID == c.CarID)?.User?.Username ?? "-",
                    Utilities = list
                };

                result.Add(obj);
            }

            return result;
        }
    }
}
