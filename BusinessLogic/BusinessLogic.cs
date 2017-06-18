/* Copyright (C) Miron George - All Rights Reserved
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
* Written by Miron George <george.miron2003@gmail.com>, 2016
* 
* Role:
*   All Logic. 
*
* History:
* 12.02.2016    Miron George       Created class.
*/

using AzureDataAccess;

namespace BusinessLogic
{
    /// <summary>
    /// 
    /// </summary>
    public class BusinessLogic
    {
        public AuthLogic AuthLogic;
        public CarLogic CarLogic;
        public CarUtilityLogic CarUtilityLogic;
        public DriverCarLogic DriverCarLogic;
        public MessageLogic MessageLogic;
        public TokenLogic TokenLogic;
        public UserLogic UserLogic;
        public UtilityLogic UtilityLogic;


        /// <summary>
        /// 
        /// </summary>
        /// <param name="dataAccess"></param>
        public BusinessLogic(IAzureDataAccess dataAccess)
        {
            AuthLogic = new AuthLogic(dataAccess);
            CarLogic = new CarLogic(dataAccess);
            CarUtilityLogic = new CarUtilityLogic(dataAccess);
            DriverCarLogic = new DriverCarLogic(dataAccess);
            MessageLogic = new MessageLogic(dataAccess);
            TokenLogic = new TokenLogic(dataAccess);
            UserLogic = new UserLogic(dataAccess);
            UtilityLogic = new UtilityLogic(dataAccess);
        }
    }
}
