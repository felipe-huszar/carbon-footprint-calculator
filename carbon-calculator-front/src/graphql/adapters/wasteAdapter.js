export const convertInputFields = (input) => {        
    const recycleAluminumSteelCans = input.recycleAluminumSteelCans || false;
    const recyclePlastic = input.recyclePlastic || false;
    const recycleGlass = input.recycleGlass || false;
    const recycleNewspaper = input.recycleNewspaper || false;
    const recycleMagazines = input.recycleMagazines || false;
    const startRecycleAluminumSteelCans = input.startRecycleAluminumSteelCans || false;
    const startRecyclePlastic = input.startRecyclePlastic || false;
    const startRecycleGlass = input.startRecycleGlass || false;
    const startRecycleNewspaper = input.startRecycleNewspaper || false;
    const startRecycleMagazines = input.startRecycleMagazines || false;                 
        
    return {            
        recycleAluminumSteelCans,
        recyclePlastic,
        recycleGlass,
        recycleNewspaper,
        recycleMagazines,
        reduction: {
            recycleAluminumSteelCans: startRecycleAluminumSteelCans,
            recyclePlastic: startRecyclePlastic,
            recycleGlass: startRecycleGlass,
            recycleNewspaper: startRecycleNewspaper,
            recycleMagazines: startRecycleMagazines
        }
    };
};