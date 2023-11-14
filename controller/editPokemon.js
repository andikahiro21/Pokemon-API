import { handleClientError, handleServerError } from "../helpers/handleError.js";
import { loadData, storeData } from "../helpers/databaseHelper.js";
import joi from "joi";

export const releasePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    let isPrime = true;
    const data = loadData();

    const validate = data.MyPokemon.find((item) => item.id === id);
    if (!validate) {
      return handleClientError(res, 404, "You do not have a Pokemon with that ID.");
    } else {
      const prima = Math.floor(Math.random() * 15) + 1;
      for (let i = 2; i < prima; i++) {
        if (prima % i == 0) {
          isPrime = false;
          break;
        }
      }

      if (isPrime) {
        const filtered = data.MyPokemon.filter((item) => item.id !== id);
        data.MyPokemon = filtered;
        storeData(data);
        return res.status(200).json({ message: "Pokemon Released.." });
      } else {
        return res.status(200).json({ message: "Pokemon Failed to Be Released..." });
      }
    }
  } catch (error) {
    return handleServerError(res);
  }
};

export const renamePokemon = async (req, res) => {
  try {
    const { id } = req.params;
    const data = loadData();
    const fibonacci = (num) => {
      if (num < 2) {
        return num;
      } else {
        return fibonacci(num - 1) + fibonacci(num - 2);
      }
    };
    const selectedPokemon = data.MyPokemon.find((item) => item.id === id);

    if (!selectedPokemon) {
      return handleClientError(res, 404, "You do not have a Pokemon with that ID.");
    }

    const newVersion = selectedPokemon.version + 1;
    if (newVersion > 15) {
      return handleClientError(res, 403, "Be a premium member to rename your Pokemon again..");
    }

    const newName = {
      name: req.body.name,
    };
    const scheme = joi.object({
      name: joi.string().required(),
    });
    const { error } = scheme.validate(newName);
    if (error) {
      return res.status(400).json({ status: "Validation Failed", message: error.details[0].message });
    }

    const updatedPokemon = {
      id: selectedPokemon.id,
      name: `${newName.name}-${fibonacci(selectedPokemon.version)}`,
      version: selectedPokemon.version + 1,
    };

    const filtered = data.MyPokemon.filter((item) => item.id !== id);
    filtered.push(updatedPokemon);
    data.MyPokemon = filtered;
    storeData(data);

    return res.status(200).json({ data: updatedPokemon, message: "Pokemon Renamed.." });
  } catch (error) {
    return handleServerError(res);
  }
};
