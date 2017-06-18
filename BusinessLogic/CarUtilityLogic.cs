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
    public class CarUtilityLogic
    {
        private readonly IAzureDataAccess _dataAccess;

        /// <summary>
        /// 
        /// </summary>
        /// <param name="objDataAccess"></param>
        public CarUtilityLogic(IAzureDataAccess objDataAccess)
        {
            // Primesc obiectul, nu e treaba CategoryLogic ce dataAccess se foloseste
            // Unity are grija de dependency injection
            _dataAccess = objDataAccess;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<CarUtilityDTO> GetAllCarsUtilities()
        {
            var listCarsUtilities = _dataAccess.CarsUtilityRepository.GetAll().ToList();

            return listCarsUtilities.Select(u => new CarUtilityDTO
            {
                UtilityID = u.UtilityID,
                Description = u.Description,
                CarID = u.CarID,
                CarUtilityID = u.CarUtilityID,
                StartedDate = u.StartedDate,
                StartedKmNo = u.StartedKmNo
            }).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<CarUtilityDTO> GetAllUtilitiesForCar(int carId)
        {
            var listCarsUtilities = _dataAccess.CarsUtilityRepository.FindAllBy(c => c.CarID == carId).ToList();

            return listCarsUtilities.Select(u => new CarUtilityDTO
            {
                UtilityID = u.UtilityID,
                Description = u.Description,
                CarID = u.CarID,
                CarUtilityID = u.CarUtilityID,
                StartedDate = u.StartedDate,
                StartedKmNo = u.StartedKmNo
            }).ToList();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        public List<CarUtilityDTO> GetAllCarsForUtility(int utilityId)
        {
            var listCarsUtilities = _dataAccess.CarsUtilityRepository.FindAllBy(c => c.UtilityID == utilityId).ToList();

            return listCarsUtilities.Select(u => new CarUtilityDTO
            {
                UtilityID = u.UtilityID,
                Description = u.Description,
                CarID = u.CarID,
                CarUtilityID = u.CarUtilityID,
                StartedDate = u.StartedDate,
                StartedKmNo = u.StartedKmNo
            }).ToList();
        }

        /// <summary>
        /// </summary>
        /// <param name="carUtilityDto"></param>
        public void AddUtility(CarUtilityDTO carUtilityDto)
        {
            var carUtility = new CarsUtility()
            {
                UtilityID = carUtilityDto.UtilityID,
                Description = carUtilityDto.Description,
                CarID = carUtilityDto.CarID,
                CarUtilityID = carUtilityDto.CarUtilityID,
                StartedDate = carUtilityDto.StartedDate,
                StartedKmNo = carUtilityDto.StartedKmNo
            };

            _dataAccess.CarsUtilityRepository.Add(carUtility);
        }

        /// <summary>
        /// </summary>
        /// <param name="carUtilityId"></param>
        public void DeleteCarUtility(int carUtilityId)
        {
            var carUtility = _dataAccess.CarsUtilityRepository.FindFirstBy(u => u.CarUtilityID == carUtilityId);
            _dataAccess.CarsUtilityRepository.Delete(carUtility);
        }
    }
}
