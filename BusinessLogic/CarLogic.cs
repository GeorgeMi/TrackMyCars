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
        /// </summary>
        /// <param name="carDto"></param>
        public void AddCar(CarDTO carDto)
        {
            var car = new Car
            {
                CarID = carDto.CarID,
                Brand = carDto.Brand,
                KmNo = carDto.KmNo,
                RegNo = carDto.RegNo,
                Year = carDto.Year
            };

            _dataAccess.CarRepository.Add(car);
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
