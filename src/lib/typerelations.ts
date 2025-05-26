// type TypeRelations = {
//   double_damage_from: { name: string; url: string }[];
//   double_damage_to: { name: string; url: string }[];
//   half_damage_from: { name: string; url: string }[];
//   half_damage_to: { name: string; url: string }[];
//   no_damage_from: { name: string; url: string }[];
//   no_damage_to: { name: string; url: string }[];
// };

// type TypeData = {
//   name: string;
//   damage_relations: TypeRelations;
// };

// type PokemonData = {
//   name: string;
//   types: { type: { name: string; url: string } }[];
// };

// export async function fetchTypeData(
//   name: string,
//   isType: boolean,
// ): Promise<{ name: string; types: string[] } | { error: string }> {
//   try {
//     name = name.toLowerCase().trim();

//     if (isType) {
//       // Fetch data for a specific type
//       const response = await fetch(`https://pokeapi.co/api/v2/type/${name}`);
//       if (!response.ok) {
//         return { error: `Type '${name}' not found` };
//       }
//       return { name, types: [name] };
//     } else {
//       // Fetch data for a Pokemon
//       const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
//       if (!response.ok) {
//         return { error: `Pokemon '${name}' not found` };
//       }
//       const data: PokemonData = (await response.json()) as PokemonData;
//       const types = data.types.map((t) => t.type.name);
//       return { name: data.name, types };
//     }
//   } catch (error) {
//     return { error: `Error fetching type data` };
//   }
// }

// export async function calculateTypeEffectiveness(
//   attackingType: string,
//   defendingTypes: string[],
// ): Promise<{ effectiveness: number; explanation: string } | { error: string }> {
//   try {
//     // Fetch attacking type data
//     const attackResponse = await fetch(
//       `https://pokeapi.co/api/v2/type/${attackingType.toLowerCase()}`,
//     );
//     if (!attackResponse.ok) {
//       return { error: `Type '${attackingType}' not found` };
//     }
//     const attackData: TypeData = (await attackResponse.json()) as TypeData;

//     // Calculate effectiveness for each defending type
//     let totalEffectiveness = 1;
//     const explanationSteps: string[] = [];

//     for (const defendingType of defendingTypes) {
//       let effectiveness = 1;
//       let explanation = "";

//       // Check if the attacking type is super effective against the defending type
//       if (
//         attackData.damage_relations.double_damage_to.some(
//           (t) => t.name === defendingType,
//         )
//       ) {
//         effectiveness = 2;
//         explanation = `${attackingType} is super effective (2x) against ${defendingType}`;
//       }
//       // Check if the attacking type is not very effective against the defending type
//       else if (
//         attackData.damage_relations.half_damage_to.some(
//           (t) => t.name === defendingType,
//         )
//       ) {
//         effectiveness = 0.5;
//         explanation = `${attackingType} is not very effective (0.5x) against ${defendingType}`;
//       }
//       // Check if the attacking type has no effect against the defending type
//       else if (
//         attackData.damage_relations.no_damage_to.some(
//           (t) => t.name === defendingType,
//         )
//       ) {
//         effectiveness = 0;
//         explanation = `${attackingType} has no effect (0x) against ${defendingType}`;
//       } else {
//         explanation = `${attackingType} has normal effectiveness (1x) against ${defendingType}`;
//       }

//       totalEffectiveness *= effectiveness;
//       explanationSteps.push(explanation);

//       // If one of the types has no effect, the total effectiveness is 0
//       if (effectiveness === 0) {
//         return {
//           effectiveness: 0,
//           explanation: `${attackingType} has no effect against ${defendingType}, so the overall effectiveness is 0x.`,
//         };
//       }
//     }

//     // Create the final explanation
//     let finalExplanation = "";
//     if (defendingTypes.length === 1) {
//       finalExplanation = explanationSteps[0];
//     } else {
//       finalExplanation = `${explanationSteps.join(". ")}. The combined effectiveness is ${totalEffectiveness}x.`;
//     }

//     return { effectiveness: totalEffectiveness, explanation: finalExplanation };
//   } catch (error) {
//     return { error: `Error calculating effectiveness` };
//   }
// }
