/* Copyright (C) Miron George - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Miron George <george.miron2003@gmail.com>, 2016
 */

using Microsoft.Practices.Unity;
using System.Collections.Generic;
using DataTransferObject;

namespace WebAPI.Models
{

    /// <summary>
    /// 
    /// </summary>
    public class UtilityModel
    {
        private readonly BusinessLogic.BusinessLogic _bl;
        /// <summary>
        /// Constructor. Initializeaza Unity container si injecteaza dependenta in BLL si DAL 
        /// </summary>
        public UtilityModel()
        {
            IUnityContainer objContainer = new UnityContainer();
            objContainer.RegisterType<BusinessLogic.BusinessLogic>();
            objContainer.RegisterType<AzureDataAccess.IAzureDataAccess, AzureDataAccess.AzureDataAccess>();
            _bl = objContainer.Resolve<BusinessLogic.BusinessLogic>();
        }

        /// <summary>
        /// 
        /// </summary>
        public List<UtilityDTO> GetAllUtilities()
        {
            try
            {
                return _bl.UtilityLogic.GetAllUtilities();
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        ///  
        /// </summary>
        /// <param name="utilityDto"></param>
        /// <returns>true sau false</returns>
        public bool AddUtility(UtilityDTO utilityDto)
        {
            try
            {
                _bl.UtilityLogic.AddUtility(utilityDto);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        ///  
        /// </summary>
        /// <param name="utilityId"></param>
        /// <returns>true sau false</returns>
        public bool DeleteUtility(int utilityId)
        {
            try
            {
                _bl.UtilityLogic.DeleteUtility(utilityId);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}