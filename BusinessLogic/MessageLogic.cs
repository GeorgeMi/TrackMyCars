/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */

using AzureDataAccess;
using DataTransferObject;
using System.Linq;
using System.Net.Mail;

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
    }
}
