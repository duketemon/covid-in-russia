import os
import json
import numpy as np
import pandas as pd


def start_processing(data_path):
    infected_df = pd.read_csv(data_path + 'data-infected.csv')
    healed_df = pd.read_csv(data_path + 'data-healed.csv')
    died_df = pd.read_csv(data_path + 'data-died.csv')

    data = dict()
    dates = infected_df.columns.tolist()[2:]
    size = len(dates) 
    russia_infected, russia_healed, russia_died = np.full(size, 0, dtype=int), np.full(size, 0, dtype=int), np.full(size, 0, dtype=int)
    for subject in infected_df['Субъект'].values:
        infected_values = infected_df[infected_df['Субъект'] == subject].values[0][2:]
        russia_infected = russia_infected + infected_values
        
        healed_values = healed_df[healed_df['Субъект'] == subject].values[0][2:]
        russia_healed = russia_healed + healed_values
        
        died_values = died_df[died_df['Субъект'] == subject].values[0][2:]
        russia_died = russia_died + died_values

        data[subject] = {
            'infected': infected_values.tolist(),
            'healed': healed_values.tolist(),
            'died': died_values.tolist()
        }
    data['Россия'] = {
        'infected': russia_infected.tolist(),
        'healed': russia_healed.tolist(),
        'died': russia_died.tolist()
    }
    return data, dates


data_path = '../covid-russia/'
data, dates = start_processing(data_path)
output_filename = 'stats.js'
os.system(f'echo "STATS_DATES = {str(dates)}\nSTATS_DATA = " > {output_filename}')
with open(output_filename, 'a') as f:
    json.dump(data, f, ensure_ascii=False)
