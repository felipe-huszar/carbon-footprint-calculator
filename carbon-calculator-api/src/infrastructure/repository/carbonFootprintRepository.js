const { CarbonFootprintCategory } = require('../../enums/carbonFootprintEnums');

class CarbonFootprintRepository {
    constructor() {
        this.init();
    }

    init() {
        this.store = {
            sections: {
                [CarbonFootprintCategory.HOME_ENERGY]: { currentTotalEmission: 0, currentTotalEmissionAfterPlannedActions: 0, usAverage: 2900 },
                [CarbonFootprintCategory.TRANSPORTATION]: { currentTotalEmission: 0, currentTotalEmissionAfterPlannedActions: 0, usAverage: 1500 },
                [CarbonFootprintCategory.WASTE]: { currentTotalEmission: 0, currentTotalEmissionAfterPlannedActions: 0, usAverage: 1200 },
            },            
            initialConfig: { numberOfPeoplehousehold: 0, zipCode: '' },
        };
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new CarbonFootprintRepository();
        }
        return this.instance;
    }

    setSectionSummary(section, summary) {
        this.store.sections[section].currentTotalEmission = summary.currentTotalEmission;
        this.store.sections[section].currentTotalEmissionAfterPlannedActions = summary.currentTotalEmissionAfterPlannedActions;
    }

    setInitialParameters(numberOfPeoplehousehold, zipCode) {
        this.store.initialConfig = { numberOfPeoplehousehold, zipCode };
    }

    getSectionSummary(section) {
        return this.store.sections[section];
    }

    getInitialParameters() {
        return this.store.initialConfig;
    }

    getTotalSummary() {
        const sections = Object.keys(this.store.sections);
        const totalSummary = sections.reduce((acc, section) => {
            // Initialize each property of the accumulator to avoid NaN
            if (!acc.currentTotalEmission) acc.currentTotalEmission = 0;
            if (!acc.currentTotalEmissionAfterPlannedActions) acc.currentTotalEmissionAfterPlannedActions = 0;
            if (!acc.usAverage) acc.usAverage = 0;
            
            // Add the values from each section to the corresponding property of the accumulator
            acc.currentTotalEmission += this.store.sections[section].currentTotalEmission;
            acc.currentTotalEmissionAfterPlannedActions += this.store.sections[section].currentTotalEmissionAfterPlannedActions;
            acc.usAverage += this.store.sections[section].usAverage;
            return acc;
        }, {}); // Initialize accumulator as an empty object
        
        return totalSummary;
    }
}

const instance = CarbonFootprintRepository.getInstance();

module.exports = instance;