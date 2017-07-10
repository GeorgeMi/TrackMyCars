using System;
using AzureDataAccess;
using DataTransferObject;
using Entities;
using System.Collections.Generic;
using System.Globalization;
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
                        months = (int) u.Utility.MonthsNo;
                    }

                    int km;
                    if (u.Utility.KmNo == null)
                    {
                        km = 0;
                    }
                    else
                    {
                        km = (int) u.Utility.KmNo;
                    }

                    var expirationDate = u.StartedDate.AddMonths(months).Subtract(DateTime.Today).Days;
                    var kmNo = u.StartedKmNo + km - u.Car.KmNo;

                    list.Add(new CarUtilityDetailsDTO
                    {
                        UtilityName = u.Utility.UtilityName,
                        ExpirationDate = expirationDate >= 0 ? expirationDate : 0,
                        ExpirationKmNo = kmNo >= 0 ? kmNo : 0
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

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<CarDTO> GetAllUserCars(string username)
        {
            if (username == "Secretariat" || username == "George")
            {
                return GetAllCars();
            }

            var listCars = new List<Car>();
            foreach (var car in _dataAccess.CarRepository.GetAll().ToList())
            {
                var cardrivers = _dataAccess.DriverCarRepository.FindFirstBy(d => d.User.Username == username && d.CarID == car.CarID);

                if (cardrivers != null)
                {
                    listCars.Add(car);
                }
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
                        ExpirationDate = expirationDate  >= 0 ? expirationDate : 0,
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

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public CarDetailsDTO GetCarDetails(int carId)
        {
            var car = _dataAccess.CarRepository.FindFirstBy(c => c.CarID == carId);
            var carUilitiesList = _dataAccess.CarsUtilityRepository.FindAllBy(u => u.CarID == carId);
            var utilities = new List<UtilityCarDTO>();
            foreach (var ut in carUilitiesList)
            {
                utilities.Add(new UtilityCarDTO
                {
                    StartingDate = ut.StartedDate.ToString("yyyy-MM-dd"),
                    StartingKmNo = ut.StartedKmNo,
                    UtilityID = ut.UtilityID
                });
            }

            var list = new CarDetailsDTO
            {
                CarID = car.CarID,
                Brand = car.Brand,
                KmNo = car.KmNo,
                RegNo = car.RegNo,
                Year = car.Year,
                DriverID = _dataAccess.DriverCarRepository.FindFirstBy(d => d.CarID == carId)?.UserID ?? 0,
                UtilitiesIDs = _dataAccess.CarsUtilityRepository.FindAllBy(u => u.CarID == carId).Select(utility => utility.UtilityID).ToList(),
                Utilities = utilities
            };

            return list;
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
            
            if (null == exitingDriver && carDetailsDto.DriverID != 0)
            {
                _dataAccess.DriverCarRepository.Add(new DriversCar { CarID = carId, UserID = carDetailsDto.DriverID });
            }
            else if (exitingDriver?.UserID != carDetailsDto.DriverID && carDetailsDto.DriverID != 0)
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

            if (carDetailsDto.DriverID == 0)
            {
                if (null != exitingDriver)
                {
                    _dataAccess.DriverCarRepository.Delete(exitingDriver);
                }
            }
            else
            {
                if (null == exitingDriver)
                {
                    _dataAccess.DriverCarRepository.Add(new DriversCar
                    {
                        CarID = carDetailsDto.CarID,
                        UserID = carDetailsDto.DriverID
                    });
                }
                else if (exitingDriver.UserID != carDetailsDto.DriverID)
                {
                    _dataAccess.DriverCarRepository.Delete(exitingDriver);
                    _dataAccess.DriverCarRepository.Add(new DriversCar
                    {
                        CarID = carDetailsDto.CarID,
                        UserID = carDetailsDto.DriverID
                    });
                }
            }
            
            var allUtilities = _dataAccess.CarsUtilityRepository.FindAllBy(u => u.CarID == carDetailsDto.CarID).ToList();
            foreach (var utility in allUtilities.Where(utility => !carDetailsDto.UtilitiesIDs.Contains(utility.UtilityID)))
            {
                _dataAccess.CarsUtilityRepository.Delete(allUtilities.FirstOrDefault(u => u.UtilityID == utility.UtilityID));
            }

            foreach (var utility in carDetailsDto.Utilities)
            {
                var exitingUtility = _dataAccess.CarsUtilityRepository.FindFirstBy(u => u.CarID == carDetailsDto.CarID && u.UtilityID == utility.UtilityID);

                if (null == exitingUtility)
                {
                    //     utility.StartingDate = utility.StartingDate.Replace("-", string.Empty);
                    _dataAccess.CarsUtilityRepository.Add(new CarsUtility
                    {
                        CarID = carDetailsDto.CarID,
                        StartedDate = DateTime.ParseExact(utility.StartingDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None),
                        StartedKmNo = utility.StartingKmNo ?? 0,
                        UtilityID = utility.UtilityID
                    });
                }
                else
                {
                    exitingUtility.StartedDate = DateTime.ParseExact(utility.StartingDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None);
                    exitingUtility.StartedKmNo = utility.StartingKmNo ?? exitingUtility.StartedKmNo;

                    _dataAccess.CarsUtilityRepository.Update(exitingUtility);
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
