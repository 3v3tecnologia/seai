import { GetManagementWeightsByBasin } from "../../../../src/domain/use-cases/management";
import { ManagementCultureBuilder } from "../../../builders/management-culture-weights.builder";
import { InMemoryManagementWeightsRepository } from "../../../doubles/repositories/in-memory-management-weights.repository";

describe("Management weights", () => {
  test("Should be to calculate 'water cut' and average culture indicators", async function () {
    // Get culture weights by basin
    const managementWeightRepository =
      new InMemoryManagementWeightsRepository();
    const managementWeightBuilder = ManagementCultureBuilder.create();

    await managementWeightRepository.create([managementWeightBuilder.build()]);

    const getManagementWeightsByBasinUseCase = new GetManagementWeightsByBasin(
      managementWeightRepository
    );

    const result = await getManagementWeightsByBasinUseCase.execute({
      Id_Basin: 1,
      limit: 10,
      pageNumber: 1,
    });

    console.log(result.value);
  });
  test.todo(
    "Should be to calculate weights when data provided by the repository is 'null'"
  );
});
