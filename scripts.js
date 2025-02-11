const uniqueArray = arr => {
  return arr.filter((o, index, inputArray) =>
    inputArray.findIndex(item => JSON.stringify(item) === JSON.stringify(o)) === index
  )
}

const getEarnings = (totalTime, property, propertyCount) => {
  const { buildTime, earnings } = property || {};
  let totalEarnings = 0;
  for (let i = 1; i <= propertyCount; i++) {
    totalEarnings += (totalTime - (i * buildTime)) * earnings;
  }
  return totalEarnings;
}

const properties = {
  T: { name: 'Theatre', buildTime: 5, earnings: 1500 },
  P: { name: 'Pub', buildTime: 4, earnings: 1000 },
  C: { name: 'Commercial Park', buildTime: 10, earnings: 3000 }
}

const getMaxEarningsSolutions = timeUnits => {
  let solutions = [];
  let maxEarnings = 0;

  const compareSolutions = (T, P, C, remainingTime) => {
      if (remainingTime <= 4) {
          const theatreEarnings = getEarnings(timeUnits, properties.T, T);
          const commercialParkEarnings = getEarnings(timeUnits - (T * 5), properties.C, C);
          const pubEarnings = getEarnings(timeUnits - ((T * 5) + (C * 10)), properties.P, P);
          const totalEarnings = theatreEarnings + pubEarnings + commercialParkEarnings;

          if (totalEarnings > maxEarnings) {
              maxEarnings = totalEarnings;
              solutions = [{ T, P, C }];
          } else if (totalEarnings === maxEarnings) {
              solutions.push({ T, P, C });
          }
          return;
      }

      if (remainingTime > 5) {
        compareSolutions(T + 1, P, C, remainingTime - 5);
      }

      if (remainingTime > 4) {
        compareSolutions(T, P + 1, C, remainingTime - 4);
      }

      if (remainingTime > 10) {
        compareSolutions(T, P, C + 1, remainingTime - 10);
      }
  }

  compareSolutions(0, 0, 0, timeUnits);

  return {
      maxEarnings,
      solutions: uniqueArray(solutions)
  };
}

const showResults = (results) => {
  const container = document.querySelector('#solutions');
  container.innerHTML = '';

  const { maxEarnings, solutions } = results || {};
  if (!maxEarnings || !solutions?.length) return;

  document.querySelector('#result').style.visibility = 'visible';
  document.querySelector('#earnings').innerText = `Earnings: $${maxEarnings}`;
  solutions.forEach(solution => {
    const element = document.createElement('li');
    element.innerHTML = `${JSON.stringify(solution)}`;
    container.appendChild(element);
  });
}

const calculateMaxProfit = () => {
  const input = document.querySelector('#time')?.value;
  if (!input || isNaN(input)) {
    document.querySelector('#result').style.visibility = 'hidden';
    return;
  }

  const results = getMaxEarningsSolutions(Number(input));
  showResults(results);
}
