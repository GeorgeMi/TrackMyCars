using System;
using AzureDataAccess;
using DataTransferObject;
using Entities;
using System.Collections.Generic;
using System.Linq;

namespace BusinessLogic
{
    /// <summary>
    /// 
    /// </summary>
    public class CarLogic
    {
        private readonly IAzureDataAccess _dataAccess;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objDataAccess"></param>
        public CarLogic(IAzureDataAccess objDataAccess)
        {
            // Primesc obiectul, nu e treaba CategoryLogic ce dataAccess se foloseste
            // Unity are grija de dependency injection
            _dataAccess = objDataAccess;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<CarDTO> GetAllCars()
        {
            var listCars = _dataAccess.CarRepository.GetAll().ToList();

            return listCars.Select(c => new CarDTO
            {
                CarID = c.CarID,
                Brand = c.Brand,
                KmNo = c.KmNo,
                RegNo = c.RegNo,
                Year = c.Year
            }).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public CarDetailsDTO GetCarDetails(int carId)
        {
            var car = _dataAccess.CarRepository.FindFirstBy(c => c.CarID == carId);
            return new CarDetailsDTO
            {
                CarID = car.CarID,
                Brand = car.Brand,
                KmNo = car.KmNo,
                RegNo = car.RegNo,
                Year = car.Year,
                DriverID = _dataAccess.DriverCarRepository.FindFirstBy(d => d.CarID == carId).UserID,
                UtilitiesIDs = _dataAccess.CarsUtilityRepository.FindAllBy(u => u.CarID == carId).Select(utility => utility.UtilityID).ToList()
            };
        }

        /// <summary>
        /// </summary>
        /// <param name="carDetailsDto"></param>
        public void AddCar(CarDetailsDTO carDetailsDto)
        {
            var car = new Car
            {
                Brand = carDetailsDto.Brand,
                KmNo = carDetailsDto.KmNo,
                RegNo = carDetailsDto.RegNo,
                Year = carDetailsDto.Year
            };

            var carId = _dataAccess.CarRepository.AddCarReturnIndex(car);

            var exitingDriver = _dataAccess.DriverCarRepository.FindFirstBy(d => d.CarID == carId);
            
            if (null == exitingDriver)
            {
                _dataAccess.DriverCarRepository.Add(new DriversCar { CarID = carId, UserID = carDetailsDto.DriverID });
            }
            else if (exitingDriver.UserID != carDetailsDto.DriverID)
            {
                _dataAccess.DriverCarRepository.Delete(exitingDriver);
                _dataAccess.DriverCarRepository.Add(new DriversCar { CarID = carId, UserID = carDetailsDto.DriverID });
            }
        }

        /// <summary>
        /// </summary>
        /// <param name="carDetailsDto"></param>
        public void UpdateCar(CarDetailsDTO carDetailsDto)
        {
            var car = new Car
            {
                CarID = carDetailsDto.CarID,
                Brand = carDetailsDto.Brand,
                KmNo = carDetailsDto.KmNo,
                RegNo = carDetailsDto.RegNo,
                Year = carDetailsDto.Year
            };
            
            _dataAccess.CarRepository.Update(car);

            var exitingDriver = _dataAccess.DriverCarRepository.FindFirstBy(d => d.CarID == carDetailsDto.CarID);
            if (null == exitingDriver)
            {
                _dataAccess.DriverCarRepository.Add(new DriversCar { CarID = carDetailsDto.CarID, UserID = carDetailsDto.DriverID });
            }
            else if (exitingDriver.UserID != carDetailsDto.DriverID)
            {
                _dataAccess.DriverCarRepository.Delete(exitingDriver);
                _dataAccess.DriverCarRepository.Add(new DriversCar { CarID = carDetailsDto.CarID, UserID = carDetailsDto.DriverID });
            }

            var allUtilities = _dataAccess.CarsUtilityRepository.FindAllBy(u => u.CarID == carDetailsDto.CarID);
            foreach (var utility in allUtilities)
            {
                if (!carDetailsDto.UtilitiesIDs.Contains(utility.UtilityID))
                {
                    _dataAccess.CarsUtilityRepository.Delete(allUtilities.FirstOrDefault(u => u.UtilityID == utility.UtilityID));
                }
            }

            foreach (var utilityID in carDetailsDto.UtilitiesIDs)
            {
                var exitingUtility = _dataAccess.CarsUtilityRepository.FindFirstBy(u => u.CarID == carDetailsDto.CarID && u.UtilityID == utilityID);
                if (null == exitingUtility)
                {
                    _dataAccess.CarsUtilityRepository.Add(new CarsUtility
                    {
                        CarID = carDetailsDto.CarID,
                        StartedDate = DateTime.Now,
                        StartedKmNo = carDetailsDto.KmNo,
                        UtilityID = utilityID
                    });
                }
            }
        }

        /// <summary>
        /// </summary>
        /// <param name="carId"></param>
        public void DeleteCar(int carId)
        {
            var car = _dataAccess.CarRepository.FindFirstBy(c => c.CarID == carId);
            _dataAccess.CarRepository.Delete(car);
        }
    }
}
