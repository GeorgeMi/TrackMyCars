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
    public class CarModel
    {
        private readonly BusinessLogic.BusinessLogic _bl;
        /// <summary>
        /// Constructor. Initializeaza Unity container si injecteaza dependenta in BLL si DAL 
        /// </summary>
        public CarModel()
        {
            IUnityContainer objContainer = new UnityContainer();
            objContainer.RegisterType<BusinessLogic.BusinessLogic>();
            objContainer.RegisterType<AzureDataAccess.IAzureDataAccess, AzureDataAccess.AzureDataAccess>();
            _bl = objContainer.Resolve<BusinessLogic.BusinessLogic>();
        }

        /// <summary>
        /// 
        /// </summary>
        public List<CarDTO> GetAllCars()
        {
            try
            {
                return _bl.CarLogic.GetAllCars();
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        ///  
        /// </summary>
        /// <param name="carDto"></param>
        /// <returns>true sau false</returns>
        public bool AddCar(CarDTO carDto)
        {
            try
            {
                _bl.CarLogic.AddCar(carDto);
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
        /// <param name="carId"></param>
        /// <returns>true sau false</returns>
        public bool DeleteCar(int carId)
        {
            try
            {
                _bl.CarLogic.DeleteCar(carId);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}