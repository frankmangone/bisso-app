import React, { Component } from 'react';

import './ExportView.css';

class ExportView extends Component {

  generateCode () {
      /* Sets  ----------------------- */
      let s = "";

      s += this.generateSets();
      s += this.generateParameters();
      s += this.generatePositiveVariables();
      s += this.generateBinaryVariables();
      s += this.generateOtherVariables();
      s += this.generateEquationNames();
      s += this.generateEquationExpressions();
      s += this.generateSolutionPool();
      return s;
  }

  generateSets () {
    let data = this.props.data;
    let aux = "Sets\n\n";

    // Streams --------------------------------------------------
    aux += "ST \"streams, not considering supplies\" /\n";
    aux += '\tFEEDSTOCK\n';
    for (var i = 0; i < data.stages.length; i++) {
      for (var j = 0; j < data.stages[i].streams.length; j++) {
        aux += "\t" + data.stages[i].streams[j].name + "\n";
      }
    }
    aux += "/\n\n";

    // Feedstocks -----------------------------------------------
    aux += "F \"feedstocks\" /\n";    
    for (i = 0; i < data.feedstocks.length; i++) {
        aux += "\t" + data.feedstocks[i].name + "\n";      
    }
    aux += "/\n\n";

    // Intermediaries (streams) ---------------------------------
    for (i = 0; i < data.stages.length; i++) {
      aux += "I"+(i+1)+"(ST) \"intermediaries after stage "+(i+1)+" technologies\" /\n";
      for (j = 0; j < data.stages[i].streams.length; j++) {
        aux += "\t" + data.stages[i].streams[j].name + "\n";
      }
      aux += "/\n\n";
    }

    // Final products (streams) ---------------------------------
    aux += "P(ST) \"final products\" /\n";
    for (i = 0; i < data.stages.length; i++) {
      for (j = 0; j < data.stages[i].streams.length; j++) {
        if (data.stages[i].streams[j].is_product) {
          aux += "\t" + data.stages[i].streams[j].name + "\n";
        }
      }
    }
    aux += "/\n\n";
    
    // Supplies -------------------------------------------------
    aux += "S \"supplies\" /\n";
    for (i = 0; i < data.supplies.length; i++) {
        aux += "\t" + data.supplies[i].name + "\n";
    }
    aux += "/\n\n";

    // Technologies ---------------------------------------------
    aux += "J \"technologies\" /\n";
    for (i = 0; i < data.stages.length; i++) {
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        aux += "\t" + data.stages[i].blocks[j].name + "\n";
      }
    }
    aux += "/\n\n";

    for (i = 0; i < data.stages.length; i++) {
      aux += "J"+(i+1)+"(J) \"stage "+(i+1)+" technologies\" /\n";
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        aux += "\t" + data.stages[i].blocks[j].name + "\n";
      }
      aux += "/\n\n";
    }

    // Offsite Utilities ------------------------------------------------
    aux += "U \"offsite utilities\" /\n";
    for (i = 0; i < data.offsite_utilities.length; i++) {
        aux += "\t" + data.offsite_utilities[i].name + "\n";
    }
    aux += "/\n\n";

    // Purchased Utilities ------------------------------------------------
    aux += "PU \"purchased utilities\" /\n";
    for (i = 0; i < data.purchased_utilities.length; i++) {
        aux += "\t" + data.purchased_utilities[i].name + "\n";
    }
    aux += "/\n\n";

    // Operation type -------------------------------------------
    aux += "OP \"operation type\" /\n";
    aux += "\tsol\n";
    aux += "\tsol_flu\n";
    aux += "\tflu\n";
    aux += "/\n\n";

    // Combinations ---------------------------------------------
    let p = data.feedstocks.length;
    for (i = 0; i < data.stages.length; i++) {
      p *= data.stages[i].blocks.length;
      aux += "g"+(i+1)+" \"technology path combinations up to stage "+(i+1)+"\" /1*"+p+"/\n";
    }
    aux += "\n";

    // Index mapping --------------------------------------------
    p = "";
    aux += "* Index mapping (direct mapping from path, to g\"n\" index) -----\n\n";
    for (i = 0; i < data.stages.length; i++) {  
      p = "J"+(i+1)+","+p;
      aux += "index_map_"+(i+1)+"("+p+"F,g"+(i+1)+")\n";
    }
    aux += "\n";

    aux += "proj_years \"Total lifespan of the project, set\" /1*"+data.optimization_options.lifetime+"/\n\n"

    aux += "\n*End of sets --------------------------------------------------\n;\n";
    aux += "\n\n";

    p = "";
    let q = "";

    for (i = 0; i < data.stages.length; i++) {
      p = "J"+(i+1)+","+p;
      q = "";
      aux += "loop(("+p+"F),\n";
        aux += "\tindex_map_"+(i+1)+"("+p+"F,g"+(i+1)+")$(\n";
          aux += "\t\tord(g"+(i+1)+") = ord(J"+(i+1)+")\n";
          for(j = i; j > -1; j--) {
            q += "card(J"+(j+1)+")*";
            if (j !== 0) {
              aux += "\t\t\t+ "+q+"(ord(J"+j+") - 1)\n";
            }
            else {
              aux += "\t\t\t+ "+q+"(ord(F) - 1)\n";
            }
          }
        aux += "\t) = yes;\n";
      aux += ");\n\n";
    }

    aux += "\n\n";

    return aux;
  }

  //
  //
  //

  generateParameters () {
    let data = this.props.data;
    let aux = "Parameters\n\n";

    let p;

    aux += "* Key streams ----------\n\n";
    for (var i = 0; i < data.stages.length; i++) {
      aux += "X_keystream_"+(i+1)+"(ST, g"+(i+1)+") \"key streams for stage "+(i+1)+" technologies (% of capacity)\"\n";
    }
    aux += "\n";

    aux += "* Inputs ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "INP_"+(i+1)+"(ST, g"+(i+1)+") \"inputs for stage "+(i+1)+" technologies (% of capacity)\"\n";
    }
    aux += "\n";

    aux += "* Outputs ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "OUT_"+(i+1)+"(ST, g"+(i+1)+") \"outputs for stage "+(i+1)+" technologies (% of capacity)\"\n";
    }
    aux += "\n";

    aux += "* Supplies ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "SUP_"+(i+1)+"(S, g"+(i+1)+") \"supplies for stage "+(i+1)+" technologies (% of capacity)\"\n";
    }
    aux += "\n";

    aux += "* Utilities (offsite facilities) ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "UTIL_"+(i+1)+"(U, g"+(i+1)+") \"utilities for stage "+(i+1)+" technologies (with corresponding units)\"\n";
    }
    aux += "\n";

    aux += "* Purchased utilities ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "PUR_UTIL_"+(i+1)+"(PU, g"+(i+1)+") \"purchased utilities for stage "+(i+1)+" technologies (USD/year)\"\n";
    }
    aux += "\n";

    aux += "* Equipment costs ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "C_E_"+(i+1)+"(g"+(i+1)+") \"installed cost for stage  "+(i+1)+" technologies (USD)\"\n";
    }
    aux += "\n";

    aux += "* Labor-related parameters ----------\n\n";
    aux += "N_ops_tech(J,OP) \"number of unit operations of each type inside a technology\"\n\n";

    aux += "* Offsite facility parameters ----------\n\n";
    aux += "A_off(U) \"Offsite facility cost pre-exponential factor\" /\n"
    for (i = 0; i < data.offsite_utilities.length; i++) {
      aux += "\t" + data.offsite_utilities[i].name + this.justifySpaces(data.offsite_utilities[i].name, 25) + data.offsite_utilities[i].a + "\n";
    }
    aux += "/\n\n";
    aux += "b_off(U) \"Offsite facility cost exponential factor\" /\n"
    for (i = 0; i < data.offsite_utilities.length; i++) {
      aux += "\t" + data.offsite_utilities[i].name + this.justifySpaces(data.offsite_utilities[i].name, 25) + data.offsite_utilities[i].b + "\n";
    }
    aux += "/\n\n";
    
    aux += "* Supply costs ----------\n\n";
    aux += "S_costs(S)  \"supplies unitary costs (USD/kg)\" /\n";
    for (i = 0; i < data.supplies.length; i++) {
      aux += "\t" + data.supplies[i].name + this.justifySpaces(data.supplies[i].name, 25) + data.supplies[i].unit_cost + "\n";
    }
    aux += "/\n\n";

    aux += "* Stream costs ----------\n\n";
    aux += "ST_costs(ST)  \"streams unitary costs (USD/kg) ** EXCLUDING FEEDSTOCKS **\" /\n";
    for (i = 0; i < data.stages.length; i++) {
      for (var j = 0; j < data.stages[i].streams.length; j++) {
        aux += "\t" + data.stages[i].streams[j].name + this.justifySpaces(data.stages[i].streams[j].name, 25) + data.stages[i].streams[j].unit_cost + "\n";
      }
    }
    aux += "/\n\n";

    aux += "* Stream selling prices ----------\n\n";
    aux += "ST_prices(ST)  \"streams unitary selling prices (USD/kg) ** EXCLUDING FEEDSTOCKS **\" /\n";
    for (i = 0; i < data.stages.length; i++) {
      for (var j = 0; j < data.stages[i].streams.length; j++) {
        aux += "\t" + data.stages[i].streams[j].name + this.justifySpaces(data.stages[i].streams[j].name, 25) + data.stages[i].streams[j].selling_price + "\n";
      }
    }
    aux += "/\n\n";

    aux += "* Feedstock costs ----------\n\n";
    aux += "C_F(F)  \"feedstocks unitary costs (USD/kg)\" /\n";
    for (i = 0; i < data.feedstocks.length; i++) {
      aux += "\t" + data.feedstocks[i].name + this.justifySpaces(data.feedstocks[i].name, 25) + data.feedstocks[i].unit_cost + "\n";
    }
    aux += "/\n\n";

    aux += "* Project years ----------\n\n";
    aux += "n(proj_years)  \"Current year of the proyect\" /\n";
    for (i = 1; i <= parseInt(data.optimization_options.lifetime); i++) {
      aux += "\t" + i + this.justifySpaces(i.toString(), 25) + i + "\n";
    }
    aux += "/;\n\n";

    aux += "Scalars\n\n";
    aux += "\tM \"Big M for restricting intermediaries binaries\" /"+data.optimization_options.big_M+"/\n\n";
    aux += "\tCEPCI_adj \"CEPCI adjustment for costs\" /0.95538/\n\n";
    aux += "\tX_min \"Minimum flow for technologies\" /1/\n\n";
    aux += "\tbase_salary \"Operator base salary per year (USD)\" /"+data.optimization_options.base_salary+"/\n\n";
    aux += "\tr \"Rate of Interest\" /"+data.optimization_options.rate_of_interest+"/\n\n";
    aux += "\tannualization_factor \"Annualization Factor for Annualized Costs\" /"+data.optimization_options.annualization_factor+"/\n\n";
    aux += ";\n\n\n";

    // Heavyweight parameter loading: ------------------

    let name;
    let tuvieja;
    let flag;

    aux += "* Key streams ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      flag = false;
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        for (var k = 0; k < data.stages[i].blocks[j].key_streams.length; k++) {
          flag = true;
          // i = stage
          // j = block
          // k = key stream in block
          tuvieja = data.stages[i].blocks[j].key_streams[k]; // tuvieja is the keystream
          name = this.getStreamName(tuvieja.stage, tuvieja.stream);
          aux += "X_keystream_"+(i+1)+"('"+name+"',g"+(i+1)+")$(index_map_"+(i+1)+"(";
          aux += "'"+this.getTechnologyName(i, j)+"',";
          for (var m = tuvieja.path.length - 1; m > -1; m--) {
            // m = stage
            aux += "'"+this.getTechnologyName(m, tuvieja.path[m])+"',";
          }
          aux += "'"+this.getFeedstockName(tuvieja.feedstock)+"',g"+(i+1)+")) = ";
          aux += tuvieja.value + ";\n";
        }
      }
      if (!flag) {
        aux += 'X_keystream_'+(i+1)+'(ST,g'+(i+1)+') = 0;\n';
      }
      aux += "\n";
    }

    aux += "* Inputs ----------\n\n";
    // Identical to keystreams, for now

    for (i = 0; i < data.stages.length; i++) {
      flag = false;
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        for (k = 0; k < data.stages[i].blocks[j].key_streams.length; k++) {
          flag = true;
          // i = stage
          // j = block
          // k = key stream in block
          tuvieja = data.stages[i].blocks[j].key_streams[k];
          aux += "INP_"+(i+1)+"('"+this.getStreamName(tuvieja.stage, tuvieja.stream)+"',g"+(i+1)+")$(index_map_"+(i+1)+"(";
          aux += "'"+this.getTechnologyName(i,j)+"',";
          for (m = tuvieja.path.length-1; m > -1; m--) {
            aux += "'"+this.getTechnologyName(m,tuvieja.path[m])+"',";
          }
          aux += "'"+this.getFeedstockName(tuvieja.feedstock)+"',g"+(i+1)+")) = "+tuvieja.value+";\n";
        }
      }
      if (!flag) {
        aux += 'INP_'+(i+1)+'(ST,g'+(i+1)+') = 0;\n';
      }
      aux += "\n";
    }

    aux += "* Outputs ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      flag = false;
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        for (k = 0; k < data.stages[i].blocks[j].outputs.length; k++) {
          flag = true;
          // i = stage
          // j = block
          // k = output in block
          tuvieja = data.stages[i].blocks[j].outputs[k]; // tuvieja is the output
          name = this.getStreamName(tuvieja.stage, tuvieja.stream);
          aux += "OUT_"+(i+1)+"('"+name+"',g"+(i+1)+")$(index_map_"+(i+1)+"(";
          aux += "'"+this.getTechnologyName(i, j)+"',";
          for (m = tuvieja.path.length - 1; m > -1; m--) {
            // m = stage
            aux += "'"+this.getTechnologyName(m, tuvieja.path[m])+"',";
          }
          aux += "'"+this.getFeedstockName(tuvieja.feedstock)+"',g"+(i+1)+")) = ";
          aux += tuvieja.value + ";\n";
        }
      }
      if (!flag) {
        aux += 'OUT_'+(i+1)+'(ST,g'+(i+1)+') = 0;\n';
      }
      aux += "\n";
    }

    aux += "* Supplies ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      flag = false;
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        for (k = 0; k < data.stages[i].blocks[j].supplies.length; k++) {
          flag = true;
          // i = stage
          // j = block
          // k = supply in block
          tuvieja = data.stages[i].blocks[j].supplies[k]; // tuvieja is the supply
          name = this.getSupplyName(tuvieja.supply);
          aux += "SUP_"+(i+1)+"('"+name+"',g"+(i+1)+")$(index_map_"+(i+1)+"(";
          aux += "'"+this.getTechnologyName(i, j)+"',";
          for (m = tuvieja.path.length - 1; m > -1; m--) {
            // m = stage
            aux += "'"+this.getTechnologyName(m, tuvieja.path[m])+"',";
          }
          aux += "'"+this.getFeedstockName(tuvieja.feedstock)+"',g"+(i+1)+")) = ";
          aux += tuvieja.value + ";\n";
        }
      }
      if (!flag) {
        aux += 'SUP_'+(i+1)+'(S,g'+(i+1)+') = 0;\n';
      }
      aux += "\n";
    }

    aux += "* Offsite utilities ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      flag = false;
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        for (k = 0; k < data.stages[i].blocks[j].offsite_utilities.length; k++) {
          flag = true;
          // i = stage
          // j = block
          // k = offsite utility in block
          tuvieja = data.stages[i].blocks[j].offsite_utilities[k]; // tuvieja is the utility
          name = this.getOffsiteUtilityName(tuvieja.utility);
          aux += "UTIL_"+(i+1)+"('"+name+"',g"+(i+1)+")$(index_map_"+(i+1)+"(";
          aux += "'"+this.getTechnologyName(i, j)+"',";
          for (m = tuvieja.path.length - 1; m > -1; m--) {
            // m = stage
            aux += "'"+this.getTechnologyName(m, tuvieja.path[m])+"',";
          }
          aux += "'"+this.getFeedstockName(tuvieja.feedstock)+"',g"+(i+1)+")) = ";
          aux += tuvieja.value + ";\n";
        }
      }
      if (!flag) {
        aux += 'UTIL_'+(i+1)+'(U,g'+(i+1)+') = 0;\n';
      }
      aux += "\n";
    }

    aux += "* Purchased utilities ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      flag = false;
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        for (k = 0; k < data.stages[i].blocks[j].purchased_utilities.length; k++) {
          flag = true;
          // i = stage
          // j = block
          // k = purchased utility in block
          tuvieja = data.stages[i].blocks[j].purchased_utilities[k]; // tuvieja is the utility
          name = this.getPurchasedUtilityName(tuvieja.utility);
          aux += "PUR_UTIL_"+(i+1)+"('"+name+"',g"+(i+1)+")$(index_map_"+(i+1)+"(";
          aux += "'"+this.getTechnologyName(i, j)+"',";
          for (m = tuvieja.path.length - 1; m > -1; m--) {
            // m = stage
            aux += "'"+this.getTechnologyName(m, tuvieja.path[m])+"',";
          }
          aux += "'"+this.getFeedstockName(tuvieja.feedstock)+"',g"+(i+1)+")) = ";
          aux += tuvieja.value + ";\n";
        }
      }
      if (!flag) {
        aux += 'PUR_UTIL_'+(i+1)+'(PU,g'+(i+1)+') = 0;\n';
      }
      aux += "\n";
    }

    aux += "* Equipment costs ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      flag = false;
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        for (k = 0; k < data.stages[i].blocks[j].direct_costs.length; k++) {
          flag = true;
          // i = stage
          // j = block
          // k = direct cost in block
          tuvieja = data.stages[i].blocks[j].direct_costs[k]; // tuvieja is the direct cost
          aux += "C_E_"+(i+1)+"(g"+(i+1)+")$(index_map_"+(i+1)+"(";
          aux += "'"+this.getTechnologyName(i, j)+"',";
          for (m = tuvieja.path.length - 1; m > -1; m--) {
            // m = stage
            aux += "'"+this.getTechnologyName(m, tuvieja.path[m])+"',";
          }
          aux += "'"+this.getFeedstockName(tuvieja.feedstock)+"',g"+(i+1)+")) = ";
          aux += tuvieja.value + ";\n";
        }
      }
      if (!flag) {
        aux += 'C_E_'+(i+1)+'(g'+(i+1)+') = 0;\n';
      }
      aux += "\n";
    }

    aux += "* Number of operations per types ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      for (j = 0; j < data.stages[i].blocks.length; j++) {
        if (data.stages[i].blocks[j].sol !== 0) {
          aux += "N_ops_tech('"+this.getTechnologyName(i, j)+"','sol') = "+data.stages[i].blocks[j].sol+";\n";
        }
        if (data.stages[i].blocks[j].sol_flu !== 0) {
          aux += "N_ops_tech('"+this.getTechnologyName(i, j)+"','sol_flu') = "+data.stages[i].blocks[j].sol_flu+";\n";
        }
        if (data.stages[i].blocks[j].flu !== 0) {
          aux += "N_ops_tech('"+this.getTechnologyName(i, j)+"','flu') = "+data.stages[i].blocks[j].flu+";\n";
        }
      }
    }
    aux += "\n";


    aux += "\n\n";
    return aux;
  }

  //
  //
  //

  generatePositiveVariables () {
    let data = this.props.data;
    let aux = "Positive variables\n\n";

    aux += "* Key stream flows ----------\n\n";
    for (var i = 0; i < data.stages.length; i++) {
      aux += "\tX_key_"+(i+1)+"(g"+(i+1)+") \"Mass flow of key stream entering stage "+(i+1)+" techs (kg/h)\"\n";
    }
    aux += "\n";

    aux += "* Net consumption and production flows ----------\n\n";
    aux += "\tX_feed(ST) \"Net feed mass flow for each stream (kg/h)\"\n";
    aux += "\tX_prod(ST) \"Net product mass flow for each stream (kg/h)\"\n";
    aux += "\n";

    aux += "* Flows for mass balance ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tX_in_"+(i+1)+"(ST,g"+(i+1)+") \"Stream inlet flow to stage "+(i+1)+" technologies (kg/h)\"\n";
      aux += "\tX_out_"+(i+1)+"(ST,g"+(i+1)+") \"Stream outlet flow from stage "+(i+1)+" technologies (kg/h)\"\n";
      aux += "\tX_sup_"+(i+1)+"(S,g"+(i+1)+") \"Supply flow to stage "+(i+1)+" technologies (kg/h)\"\n";
      aux += "\n";
      aux += "\tX_in_tot_"+(i+1)+"(ST) \"Total stream inlet to stage "+(i+1)+" technologies (kg/h)\"\n";
      aux += "\tX_out_tot_"+(i+1)+"(ST) \"Total stream outlet from stage "+(i+1)+" technologies (kg/h)\"\n";
      aux += "\tX_sup_tot_"+(i+1)+"(S) \"Total supplies entering stage "+(i+1)+" technologies (kg/h)\"\n";
      aux += "\n";
    }
    aux += "\tX_in_tot \"Total stream inlet to every technology (kg/h)\"\n";
    aux += "\tX_out_tot \"Total stream outlet from every technology (kg/h)\"\n";
    aux += "\tX_sup_tot \"Total supplies consumed in the process (kg/h)\"\n";
    aux += "\n";
    aux += "\tX_F(F) \"Flow for each feedstock, necessary for cost calculation (kg/h)\"\n";
    aux += "\n";

    aux += "* Direct costs ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tC_d_"+(i+1)+" \"Total equipment direct costs for stage "+(i+1)+" (USD)\"\n";
    }
    aux += "\tC_TE \"Total equipment direct investment (USD)\"\n";
    aux += "\n";

    aux += "* Indirect costs ----------\n\n";
    aux += "\tC_site \"Site preparation costs (USD)\"\n";
    aux += "\tC_buildings \"Building construction costs (USD)\"\n";
    aux += "\tC_other \"Other instalation costs (USD)\"\n";
    aux += "\tC_fees \"Contractor fees (USD)\"\n";
    aux += "\tC_cont \"Contingencies costs (USD)\"\n";
    aux += "\n";

    aux += "* Offsite facilities ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tC_off_"+(i+1)+"(U) \"Offsite facilities costs for utilities up to stage "+(i+1)+" (USD)\"\n";
    }
    aux += "\tC_off(U) \"Offsite facilities costs for utilities on selected technologies (USD)\"\n";
    aux += "\n";

    aux += "* Purchased utilities ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tC_util_"+(i+1)+"(PU) \"Purchased utilities costs of stage "+(i+1)+" technologies (USD/year)\"\n";
    }
    aux += "\tC_util(PU) \"Total cost for purchased utility (USD/year)\"\n";
    aux += "\n";

    aux += "* Total direct costs & capital expenses ----------\n\n";
    aux += "\tFCI \"Fixed capital investment\"\n";
    aux += "\tWC \"Working Capital\"\n";
    aux += "\tCAPEX \"Capital Expenses\"\n";
    aux += "\n";

    aux += "* Direct Wages and Benefits ----------\n\n";
    aux += "\tN_ops_type(OP) \"total operation blocks per type\"\n";
    aux += "\tN_workers \"total operators in the plant\"\n";
    aux += "\n";
    aux += "\tC_SO \"operators salaries (USD/year)\"\n";
    aux += "\tC_SSE \"engineers & supervisors salaries (USD/year)\"\n";
    aux += "\tC_SyS \"services and supplies (USD/year)\"\n";
    aux += "\tC_SAT \"technical assistants salaries (USD/year)\"\n";
    aux += "\tC_SLC \"laboratory (control) salaries (USD/year)\"\n";
    aux += "\n";
    aux += "\tDWB \"direct salaries for all facility employees (USD/year)\"\n";
    aux += "\n";
    aux += "\tMWB \"direct salaries for maintenance personnel (USD/year)\"\n";
    aux += "\tC_maintenance \"total maintenance costs, including materials and overhead (USD/year)\"\n";
    aux += "\tC_other_S \"total costs corresponding to every salary not listed above (USD/year)\"\n";
    aux += "\n";
    aux += "\tC_supplies \"total supply costs (USD/year)\"\n";
    aux += "\tC_tot_util \"total purchased utilities costs (USD/year)\"\n";
    aux += "\tC_streams \"total stream costs (USD/year)\"\n";
    aux += "\tC_feeds \"total feedstock costs (USD/year)\"\n";
    aux += "\n";

    aux += "* Opex total & Revenues ----------\n\n";
    aux += "\tOPEX \"Operative Expenses\"\n";
    aux += "\tREV \"Revenues\"\n";
    aux += "\n"; 

    aux += ";\n\n\n";
    return aux;
  }

  //
  //
  //

  generateBinaryVariables () {
    let data = this.props.data;
    let aux = "Binary variables\n\n";

    aux += "* Main selection variables ----------\n\n";
    aux += "\tY_F(F) \"Feedstock selection binary variables\"\n";
    aux += "\tY_J(J) \"Technology selection binary variables\"\n";
    aux += "\tY_P(ST) \"Stream production binary variables ( = 1 if intermediary ST is being produced)\"\n";
    aux += "\tY_C(ST) \"Stream consumption binary variables ( = 1 if intermediary ST is being consumed)\"\n";
    aux += "\n";

    aux += "* Indexed binary variables for technology selection for each stage ----------\n\n";
    for (var i = 0; i < data.stages.length; i++) {
      aux += "\tZ_J"+(i+1)+"(g"+(i+1)+")\n";
    }
    aux += "\n"; 

    aux += "* Binaries for X_dummy classification into X_feed and X_prod ----------\n\n";
    aux += "\tnu_plus(ST) \"Variable to check if X_dummy is positive\"\n";
    aux += "\tnu_minus(ST) \"Variable to check if X_dummy is negative\"\n";
    aux += "\n";   

    aux += ";\n\n\n";
    return aux;
  }

  generateOtherVariables () {
    let data = this.props.data;
    let aux = "Variables\n\n";

    aux += "* Technology inputs and outputs ----------\n\n";
    aux += "\tX_dummy(ST) \"Dummy flows for each stream (kg/h) (temporary)\"\n";
    aux += "\n";
    aux += "* Economic indicators ----------\n\n";
    aux += "\tANNUAL_COST \"Annualized cost of the project\"\n";
    aux += "\tNPV \"Net Present Value of the project\"\n";
    aux += "\n"; 
    aux += "* Objective function ----------\n\n";
    aux += "\tobj\n";
    aux += "\n";

    aux += ";\n\n\n";
    return aux;
  }

  //
  //
  //

  generateEquationNames () {
    let data = this.props.data;
    let aux = "Equations\n\n";

    aux += "* Tech mass balances ----------\n\n";
    for (var i = 0; i < data.stages.length; i++) {
      aux += "\tKEY_tech_"+(i+1)+"\n";
      aux += "\tFLOW_LOW_tech_"+(i+1)+"\n";
      aux += "\tFLOW_UPP_tech_"+(i+1)+"\n";
      aux += "\tINP_tech_"+(i+1)+"\n";
      aux += "\tOUT_tech_"+(i+1)+"\n";
      aux += "\tSUP_tech_"+(i+1)+"\n";
      aux += "\n";
    }

    aux += "* Logical restrictions / selection of one technology per stage, one feedstock, and one product ----------\n\n";
    aux += "\tfeedstock_selection\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\ttech"+(i+1)+"_selection\n";
    }
    aux += "\tprod_selection\n";
    aux += "\n";
    aux += "\tnot_all_blanks\n";
    aux += "\n";

    aux += "* Technology indexed binaries (index determined by \"path\") restrictions ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      for (var j = 1; j < 4 + i; j++) {
        aux += "\ttech"+(i+1)+"_binary"+(j)+"\n";
      }
      aux += "\n";
    }
  
    aux += "* Stream mass balance restrictions ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tstream_in_"+(i+1)+"\n";
      aux += "\tstream_out_"+(i+1)+"\n";
      aux += "\tstream_total_"+(i+1)+"\n";
    }
    aux += "\n";
    aux += "\tstream_in\n";
    aux += "\tstream_out\n";
    aux += "\tsupplies_total\n";
    aux += "\tMB_streams\n";
    aux += "\n";

    aux += "* Restrictions for intermediary binaries ----------\n\n";
    aux += "\tUB_production\n";
    aux += "\tLB_production\n";
    aux += "\tUB_consumption\n";
    aux += "\tLB_consumption\n";
    aux += "*\tUB_feeds\n";
    aux += "*\tLB_feeds\n";  
    aux += "\n";

    aux += "* X_dummy conversion to X_feed and X_prod ----------\n\n";
    aux += "\tdummy_composition\n";  
    aux += "\tpositive_binary\n";  
    aux += "\tnegative_binary\n";  
    aux += "\tdummy_not_feed\n";  
    aux += "\tdummy_not_prod\n";  
    aux += "\trelate_binaries\n";  
    aux += "\n";

    aux += "* Offsite utilities ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tutilities_"+(i+1)+"\n";
    } 
    aux += "\tutilities\n";
    aux += "\n";

    aux += "* Purchased utilities ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tpur_utilities_"+(i+1)+"\n";
    } 
    aux += "\tpur_utilities\n";
    aux += "\n";

    aux += "* Capex ----------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      aux += "\tstage_"+(i+1)+"_equipment\n";
    } 
    aux += "\tequipment_total_cost\n";
    aux += "\n";
    aux += "\tsite_costs\n";
    aux += "\tbuilding_costs\n";
    aux += "\tfees_costs\n";
    aux += "\tother_costs\n";
    aux += "\tcont_costs\n";
    aux += "\n";
    aux += "\tFCI_costs\n";
    aux += "\tWC_costs\n";
    aux += "\tcapex_costs\n";
    aux += "\n";

    aux += "* Direct Benefits and Wages ----------\n\n";
    aux += "\tnumber_ops\n";
    aux += "\ttotal_number_ops\n";
    aux += "\n";
    aux += "\tsalaries_SO\n";
    aux += "\tsalaries_SSE\n";
    aux += "\tsalaries_SyS\n";
    aux += "\tsalaries_SAT\n";
    aux += "\tsalaries_SLC\n";
    aux += "\n";
    aux += "\tDWB_salaries\n";
    aux += "\n";
    aux += "\tMWB_salaries\n";
    aux += "\tmaintenance_total\n";
    aux += "\tother_salaries\n";
    aux += "\n";
    aux += "\tpurchased_utilities_costs\n";
    aux += "\tsupplies_costs\n";
    aux += "\tstreams_costs\n";
    aux += "\tfeeds_separation\n";
    aux += "\tfeeds_UB\n";
    aux += "\tfeeds_costs\n";
    aux += "\n";
    aux += "\topex_costs\n";
    aux += "\trevenue\n";
    aux += "\n";
    aux += "\tannualization\n";
    aux += "\tnet_present_value\n";
    aux += "\n";
    aux += "\tobjective_function\n";
    aux += "\n";

    aux += ";\n\n\n\n\n";
    return aux;
  }

  //
  //
  //

  generateEquationExpressions () {
    let data = this.props.data;
    let aux = "* Equations expressions ------------------------------\n\n";
    let tabs;

    for (var i = 0; i < data.stages.length; i++) {
      aux += "* Stage "+(i+1)+"\n";
      aux += "* ----------------------\n";
      tabs = this.justifySpaces("KEY_tech_"+(i+1)+"(g"+(i+1)+")..", 30);
      aux += "KEY_tech_"+(i+1)+"(g"+(i+1)+").."+tabs+"X_key_"+(i+1)+"(g"+(i+1)+") =e= sum(ST, X_keystream_"+(i+1)+"(ST, g"+(i+1)+"))*Z_J"+(i+1)+"(g"+(i+1)+");\n";
      tabs = this.justifySpaces("FLOW_LOW_tech_"+(i+1)+"..", 30);
      aux += "FLOW_LOW_tech_"+(i+1)+".."+tabs+"sum(g"+(i+1)+", X_key_"+(i+1)+"(g"+(i+1)+")) =g= X_min*(1-Y_J('BLANK-"+(i+1)+"'));\n";
      tabs = this.justifySpaces("FLOW_UPP_tech_"+(i+1)+"..", 30);
      aux += "FLOW_UPP_tech_"+(i+1)+".."+tabs+"sum(g"+(i+1)+", X_key_"+(i+1)+"(g"+(i+1)+")) =l= M*(1-Y_J('BLANK-"+(i+1)+"'));\n";
      tabs = this.justifySpaces("INP_tech_"+(i+1)+"(ST,g"+(i+1)+")..", 30);
      aux += "INP_tech_"+(i+1)+"(ST,g"+(i+1)+").."+tabs+"X_in_"+(i+1)+"(ST,g"+(i+1)+") =e= Z_J"+(i+1)+"(g"+(i+1)+")*INP_"+(i+1)+"(ST,g"+(i+1)+");\n";
      tabs = this.justifySpaces("OUT_tech_"+(i+1)+"(ST,g"+(i+1)+")..", 30);
      aux += "OUT_tech_"+(i+1)+"(ST,g"+(i+1)+").."+tabs+"X_out_"+(i+1)+"(ST,g"+(i+1)+") =e= Z_J"+(i+1)+"(g"+(i+1)+")*OUT_"+(i+1)+"(ST,g"+(i+1)+");\n";
      tabs = this.justifySpaces("SUP_tech_"+(i+1)+"(S,g"+(i+1)+")..", 30);
      aux += "SUP_tech_"+(i+1)+"(S,g"+(i+1)+").."+tabs+"X_sup_"+(i+1)+"(S,g"+(i+1)+") =e= Z_J"+(i+1)+"(g"+(i+1)+")*SUP_"+(i+1)+"(S,g"+(i+1)+");\n";
      aux += "\n";
    }
    aux += "\n";

    aux += "* Streams total inlet or outlet flow from each stage\n";
    aux += "* ----------------------\n";
    for (var i = 0; i < data.stages.length; i++) {
      tabs = this.justifySpaces("stream_in_"+(i+1)+"(ST)..", 30);
      aux += "stream_in_"+(i+1)+"(ST).."+tabs+"X_in_tot_"+(i+1)+"(ST) =e= sum(g"+(i+1)+", X_in_"+(i+1)+"(ST, g"+(i+1)+"));\n";
      tabs = this.justifySpaces("stream_out_"+(i+1)+"(ST)..", 30);
      aux += "stream_out_"+(i+1)+"(ST).."+tabs+"X_out_tot_"+(i+1)+"(ST) =e= sum(g"+(i+1)+", X_out_"+(i+1)+"(ST, g"+(i+1)+"));\n";
      tabs = this.justifySpaces("stream_total_"+(i+1)+"(S)..", 30);
      aux += "stream_total_"+(i+1)+"(S).."+tabs+"X_sup_tot_"+(i+1)+"(S) =e= sum(g"+(i+1)+", X_sup_"+(i+1)+"(S, g"+(i+1)+"));\n";
      aux += "\n";
    }

    //

    tabs = this.justifySpaces("stream_in(ST)..", 30);
    aux += "stream_in(ST).."+tabs+"X_in_tot(ST) =e= ";
    for (i = 0; i < data.stages.length; i++) {
      if (i !== 0) {  aux += " + ";  }
      aux += "X_in_tot_"+(i+1)+"(ST)";
    }
    aux += ";\n";
    tabs = this.justifySpaces("stream_out(ST)..", 30);
    aux += "stream_out(ST).."+tabs+"X_out_tot(ST) =e= ";
    for (i = 0; i < data.stages.length; i++) {
      if (i !== 0) {  aux += " + ";  }
      aux += "X_out_tot_"+(i+1)+"(ST)";
    }
    aux += ";\n";
    tabs = this.justifySpaces("supplies_total(S)..", 30);
    aux += "supplies_total(S).."+tabs+"X_sup_tot(S) =e= ";
    for (i = 0; i < data.stages.length; i++) {
      if (i !== 0) {  aux += " + ";  }
      aux += "X_sup_tot_"+(i+1)+"(S)";
    }
    aux += ";\n";

    tabs = this.justifySpaces("MB_streams(ST)..", 30);
    aux += "MB_streams(ST).."+tabs+"X_in_tot(ST) + X_dummy(ST) =e= X_out_tot(ST);\n\n";
    
    aux += "\n";

    //

    aux += "* Streams binary equations\n";
    aux += "* ----------------------\n\n";

    tabs = this.justifySpaces("UB_production(ST)..", 30);
    aux += "UB_production(ST).."+tabs+"Y_P(ST)*M =g= X_out_tot(ST);\n";
    tabs = this.justifySpaces("LB_production(ST)..", 30);
    aux += "LB_production(ST).."+tabs+"Y_P(ST)*X_min =l= X_out_tot(ST);\n";
    aux += "\n";

    tabs = this.justifySpaces("UB_consumption(ST)..", 30);
    aux += "UB_consumption(ST).."+tabs+"Y_C(ST)*M =g= X_in_tot(ST);\n";
    tabs = this.justifySpaces("LB_consumption(ST)..", 30);
    aux += "LB_consumption(ST).."+tabs+"Y_C(ST)*X_min =l= X_in_tot(ST);\n";
    aux += "\n";

    tabs = this.justifySpaces("* UB_feeds(ST)..", 30);
    aux += "* UB_feeds(ST).."+tabs+"X_feed(ST) =l= (1 - Y_P(ST))*M;\n";
    tabs = this.justifySpaces("* UB_prods(ST)..", 30);
    aux += "* UB_prods(ST).."+tabs+"X_prod(ST) =l= (1 - Y_C(ST))*M;\n";
    aux += "\n\n";

    //

    aux += "* Selection Logical Restrictions\n";
    aux += "* ----------------------\n\n";

    tabs = this.justifySpaces("feedstock_selection..", 30);
    aux += "feedstock_selection.."+tabs+"sum(F, Y_F(F)) =e= 1;\n";
    for (i = 0; i < data.stages.length; i++) {
      tabs = this.justifySpaces("tech"+(i+1)+"_selection..", 30);
      aux += "tech"+(i+1)+"_selection.."+tabs+"sum(J"+(i+1)+", Y_J(J"+(i+1)+")) =e= 1;\n";
    }
    aux += "\n";

    tabs = this.justifySpaces("not_all_blanks..", 30);
    aux += "not_all_blanks.."+tabs;
    for (i = 0; i < data.stages.length; i++) {
      if (i !== 0) {
        aux += ' + ';
      }
      aux += "Y_J('BLANK-"+(i+1)+"')";
    }
    aux += " =l= "+data.optimization_options.blanks+";\n\n\n";
    //

    aux += "* Indices binaries\n";
    aux += "* ----------------------\n\n";
    let p;
    for (i = 0; i < data.stages.length; i++) {
      for (var j = 1; j < 4 + i; j++) {
        //
        p = "(";
        for (var k = i+1; k > 0; k--) {
          p += "J"+k+",";
        }
        p += "F,g"+(i+1)+")";
        //
        aux += "tech"+(i+1)+"_binary"+j+p+"$(index_map_"+(i+1)+p+").. Z_J"+(i+1)+"(g"+(i+1)+")";

        if (j === 1) {
          aux += " =g= ";
          for (k = i+1; k > 0; k--) {
            aux += "Y_J(J"+k+") + ";
          }
          aux += "Y_F(F) - "+(i+1)+";\n";
        }
        else if (j === 2) {
          aux += " =l= Y_F(F);\n";
        }
        else {
          aux += " =l= Y_J(J"+(j-2)+");\n";
        }

      }
      aux += "\n";
    }
    aux += "\n";

    //

    aux += "* Product selection equation\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("prod_selection..", 30);
    aux += "prod_selection.."+tabs+"sum(P, Y_P(P)) =e= 1;\n";
    aux += "\n\n";

    //

    aux += "* X_dummy separation\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("dummy_composition(ST)..", 30);
    aux += "dummy_composition(ST).."+tabs+"X_dummy(ST) =e= X_prod(ST) - X_feed(ST);\n";
    tabs = this.justifySpaces("positive_binary(ST)..", 30);
    aux += "positive_binary(ST).."+tabs+"nu_plus(ST) =g= X_dummy(ST)/M;\n";
    tabs = this.justifySpaces("negative_binary(ST)..", 30);
    aux += "negative_binary(ST).."+tabs+"nu_minus(ST) =g= -X_dummy(ST)/M;\n";
    tabs = this.justifySpaces("dummy_not_feed(ST)..", 30);
    aux += "dummy_not_feed(ST).."+tabs+"X_feed(ST) =l= M*(1-nu_plus(ST));\n";
    tabs = this.justifySpaces("dummy_not_prod(ST)..", 30);
    aux += "dummy_not_prod(ST).."+tabs+"X_prod(ST) =l= M*(1-nu_minus(ST));\n";
    tabs = this.justifySpaces("relate_binaries(ST)..", 30);
    aux += "relate_binaries(ST).."+tabs+"nu_plus(ST) + nu_minus(ST) =g= 1;\n";

    aux += "\n\n";

    //

    aux += "* Utilities facilities costs\n";
    aux += "* ----------------------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      tabs = this.justifySpaces("utilities_"+(i+1)+"(U)..", 30);
      aux += "utilities_"+(i+1)+"(U).."+tabs+"C_off_"+(i+1)+"(U) =e= sum(g"+(i+1)+", A_off(U)*(UTIL_"+(i+1)+"(U,g"+(i+1)+")**b_off(U))*Z_J"+(i+1)+"(g"+(i+1)+"));\n";
    }
    tabs = this.justifySpaces("utilities(U)..", 30);
    aux += "utilities(U).."+tabs+"C_off(U) =e= ";
    for (i = 0; i < data.stages.length; i++) {
      if (i !== 0) {  aux += " + ";  }
      aux += "C_off_"+(i+1)+"(U)";
    }
    aux += ";\n\n\n";

    //

    aux += "* Purchased utilities costs\n";
    aux += "* ----------------------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      tabs = this.justifySpaces("pur_utilities_"+(i+1)+"(PU)..", 30);
      aux += "pur_utilities_"+(i+1)+"(PU).."+tabs+"C_util_"+(i+1)+"(PU) =e= sum(g"+(i+1)+", PUR_UTIL_"+(i+1)+"(PU,g"+(i+1)+")*Z_J"+(i+1)+"(g"+(i+1)+"));\n";
    }
    tabs = this.justifySpaces("pur_utilities(PU)..", 30);
    aux += "pur_utilities(PU).."+tabs+"C_util(PU) =e= ";
    for (i = 0; i < data.stages.length; i++) {
      if (i !== 0) {  aux += " + ";  }
      aux += "C_util_"+(i+1)+"(PU)";
    }
    aux += ";\n\n\n";

    //

    aux += "* Direct and indirect capital costs\n";
    aux += "* ----------------------\n\n";
    for (i = 0; i < data.stages.length; i++) {
      tabs = this.justifySpaces("stage_"+(i+1)+"_equipment..", 30);
      aux += "stage_"+(i+1)+"_equipment.."+tabs+"C_d_"+(i+1)+" =e= sum(";
      //
      p = "(";
      for (k = i+1; k > 0; k--) {
        p += "J"+k+",";
      }
      p += "F,g"+(i+1)+")";
     //
      aux += p+"$(index_map_"+(i+1)+p+"), Z_J"+(i+1)+"(g"+(i+1)+")*C_E_"+(i+1)+"(g"+(i+1)+"));\n";
    }

    tabs = this.justifySpaces("equipment_total_cost..", 30);
    aux += "equipment_total_cost.."+tabs+"C_TE =e= ";
    for (i = 0; i < data.stages.length; i++) {
      if (i !== 0) {  aux += " + ";  }
      aux += "C_d_"+(i+1);
    }
    aux += ";\n\n";

    tabs = this.justifySpaces("site_costs..", 30);
    aux += "site_costs.."+tabs+"C_site =e= 0.15*C_TE;\n";
    tabs = this.justifySpaces("building_costs..", 30);
    aux += "building_costs.."+tabs+"C_buildings =e= 0.10*C_TE;\n";
    tabs = this.justifySpaces("other_costs..", 30);
    aux += "other_costs.."+tabs+"C_other =e= 0.05*C_TE;\n";
    tabs = this.justifySpaces("fees_costs..", 30);
    aux += "fees_costs.."+tabs+"C_fees =e= 0.03*(C_TE + C_site + C_buildings + CEPCI_adj*(C_other + sum(U, C_off(U))) );\n";
    tabs = this.justifySpaces("cont_costs..", 30);
    aux += "cont_costs.."+tabs+"C_cont =e= 0.25*(C_TE + C_site + C_buildings + CEPCI_adj*(C_other + sum(U, C_off(U))) );\n";
    aux += "\n";

    tabs = this.justifySpaces("FCI_costs..", 30);
    aux += "FCI_costs.."+tabs+"FCI =e= (C_TE + C_site + C_buildings + CEPCI_adj*(C_other + sum(U, C_off(U))) + C_fees + C_cont)*1.14;\n";
    tabs = this.justifySpaces("WC_costs..", 30);
    aux += "WC_costs.."+tabs+"WC =e= FCI*0.2;\n";
    aux += "\n\n";

    //

    aux += "* Total capex\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("capex_costs..", 30);
    aux += "capex_costs.."+tabs+"CAPEX =e= FCI + WC;\n";
    aux += "\n\n";

    //

    aux += "* Direct Wages and Benefits\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("number_ops(OP)..", 30);
    aux += "number_ops(OP).."+tabs+"N_ops_type(OP) =e= sum(J, N_ops_tech(J,OP)*Y_J(J));\n";
    tabs = this.justifySpaces("total_number_ops..", 30);
    aux += "total_number_ops.."+tabs+"N_workers =e= N_ops_type('sol')*3 + N_ops_type('sol_flu')*2 + N_ops_type('flu');\n";
    aux += "\n";
    tabs = this.justifySpaces("salaries_SO..", 30);
    aux += "salaries_SO.."+tabs+"C_SO =e= N_workers*5*base_salary;\n";
    tabs = this.justifySpaces("salaries_SSE..", 30);
    aux += "salaries_SSE.."+tabs+"C_SSE =e= 0.15*C_SO;\n";
    tabs = this.justifySpaces("salaries_SyS..", 30);
    aux += "salaries_SyS.."+tabs+"C_SyS =e= 0.06*C_SO;\n";
    tabs = this.justifySpaces("salaries_SAT..", 30);
    aux += "salaries_SAT.."+tabs+"C_SAT =e= 60000*5;\n";
    tabs = this.justifySpaces("salaries_SLC..", 30);
    aux += "salaries_SLC.."+tabs+"C_SLC =e= 65000*5;\n";
    aux += "\n";

    tabs = this.justifySpaces("DWB_salaries..", 30);
    aux += "DWB_salaries.."+tabs+"DWB =e= C_SO + C_SSE + C_SyS + C_SAT + C_SLC;\n";
    aux += "\n\n";

    //

    aux += "* Maintenance Wages & Benefits, and other costs\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("MWB_salaries..", 30);
    aux += "MWB_salaries.."+tabs+"MWB =e= FCI*0.0125*4.5;\n";
    tabs = this.justifySpaces("maintenance_total..", 30);
    aux += "maintenance_total.."+tabs+"C_maintenance =e= MWB*2.05;\n";
    aux += "\n\n";

    //

    aux += "* Salaries corresponding to RRHH, cleaning, cantine, etc.\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("other_salaries..", 30);
    aux += "other_salaries.."+tabs+"C_other_S =e= (DWB + C_maintenance)*0.23;\n";
    aux += "\n\n";

    //

    aux += "* Total cost of supplies/utilities\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("supplies_costs..", 30);
    aux += "supplies_costs.."+tabs+"C_supplies =e= sum(S, S_costs(S)*X_sup_tot(S));\n";
    tabs = this.justifySpaces("purchased_utilities_costs..", 30);
    aux += "purchased_utilities_costs.."+tabs+"C_tot_util =e= sum(PU, C_util(PU));\n";
    tabs = this.justifySpaces("streams_costs..", 30);
    aux += "streams_costs.."+tabs+"C_streams  =e= sum(ST, ST_costs(ST)*X_feed(ST));\n";
    tabs = this.justifySpaces("feeds_separation..", 30);
    aux += "feeds_separation.."+tabs+"X_in_tot('FEEDSTOCK') =e= sum(F, X_F(F));\n";
    tabs = this.justifySpaces("feeds_UB(F)..", 30);
    aux += "feeds_UB(F).."+tabs+"M*Y_F(F) =g= X_F(F);\n";
    tabs = this.justifySpaces("feeds_costs..", 30);
    aux += "feeds_costs.."+tabs+"C_feeds =e= sum(F, X_F(F)*C_F(F));\n";
    aux += "\n\n";

    //

    aux += "* Total opex & revenue\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("opex_costs..", 30);
    aux += "opex_costs.."+tabs+"OPEX =e= DWB + C_maintenance + C_other_S + C_supplies + C_streams;\n";
    tabs = this.justifySpaces("revenue..", 30);
    aux += "revenue.."+tabs+"REV =e= sum(ST, ST_prices(ST)*X_prod(ST));\n";
    aux += "\n\n";

    //

    aux += "* Economic parameters\n";
    aux += "* ----------------------\n\n";
    tabs = this.justifySpaces("annualization..", 30);
    aux += "annualization.."+tabs+"ANNUAL_COST =e= OPEX + CAPEX*"+data.optimization_options.annualization_factor+";\n";
    tabs = this.justifySpaces("net_present_value..", 30);
    aux += "net_present_value.."+tabs+"NPV =e= -CAPEX + (REV-OPEX)*sum(proj_years, 1/((1+r)**n(proj_years)) );\n";
    aux += "\n\n";

    //

    if (data.optimization_options.objective_function === "ANNUALIZED_COST") {
      aux += "* Objective function: Annualized costs\n";
      aux += "* ----------------------\n\n";
      tabs = this.justifySpaces("objective_function..", 30);
      aux += "objective_function.."+tabs+"obj =e= ANNUAL_COST;\n";
      aux += "\n\n\n\n";
      aux += "Model biomass_gui /all/;\n";
      aux += "option mip=cplex;\n";
      aux += "solve biomass_gui using mip minimizing obj;\n";
    }

    else if (data.optimization_options.objective_function === "NPV") {
      aux += "* Objective function: Net Present Value (NPV)\n";
      aux += "* ----------------------\n\n";
      tabs = this.justifySpaces("objective_function..", 30);
      aux += "objective_function.."+tabs+"obj =e= NPV;\n";
      aux += "\n\n\n\n";
      aux += "Model biomass_gui /all/;\n";
      aux += "option mip=cplex;\n";
      aux += "solve biomass_gui using mip maximizing obj;\n";
    }

    aux += "display obj.l,Y_F.l,Y_J.l,Y_P.l,Y_C.l, X_in_1.l, X_out_1.l, X_in_2.l, X_out_2.l, X_in_3.l, X_out_3.l, X_in_4.l, X_out_4.l, Z_J4.l, g4;\n";


    aux += "\n*"

    return aux;
  }

  generateSolutionPool () {
    let aux = "********************************************************************************\n";
    aux += "*************************SOLUTION POOL******************************************\n";
    aux += "********************************************************************************\n";
    aux += "\n";
    aux += "\n";
    aux += "*$Ontext\n";
    aux += "** Define sets, parameters and files to hold solutions\n";
    aux += "Set\n";
    aux += "soln 'possible solutions in the solution pool' / file1*file100/\n";
    aux += "solnpool(soln) 'actual solutions'\n";
    aux += "\n";
    aux += "file fsol\n";
    aux += "\n";
    aux += "Scalar cardsoln number of solutions in the pool;\n";
    aux += "Alias (soln,s1,s2)\n";
    aux += ";\n";
    aux += "Parameters\n";
    aux += "Y_FX(soln,F)\n";
    aux += "Y_JX(soln,J)\n";
    aux += "Y_PX(soln,ST)\n";
    aux += "Y_CX(soln,ST)\n";
    aux += "objX(soln)\n";
    aux += "Z_J4X(soln,g4);\n";
    aux += "\n";
    aux += "files fsoln, fcpx / cplex.opt /;\n";
    aux += "option limrow=0, limcol=0, optcr=0, mip=cplex;\n";
    aux += "biomass_gui.optfile=1; biomass_gui.solprint=%solprint.Quiet%; biomass_gui.savepoint = 1;\n";
    aux += "\n";
    aux += "* The code to load different solution from gdx files will be used\n";
    aux += "* several times in this program and we therefore copy it into an include file.\n";
    aux += "$onecho > readsoln.gms\n";
    aux += "execute_load 'solnpool.gdx', solnpool=Index;\n";
    aux += "cardsoln = card(solnpool); display cardsoln;\n";
    aux += "Y_FX(soln,F) = 0; Y_JX(soln,J)=0; Y_PX(soln,ST)=0; Y_CX(soln,ST)=0; objX(soln)=0;Z_J4X(soln,g4)=0;\n";
    aux += "loop(solnpool(soln),\n";
    aux += "\tput_utility fsoln 'gdxin' / solnpool.te(soln);\n";
    aux += "\texecute_loadpoint;\n";
    aux += "\tY_FX(soln,F) = Y_F.l(F);\n";
    aux += "\tY_JX(soln,J) = Y_J.l(J);\n";
    aux += "\tY_PX(soln,ST)= Y_P.l(ST);\n";
    aux += "\tY_CX(soln,ST)= Y_C.l(ST);\n";
    aux += "\tobjX(soln)=obj.l;\n";
    aux += "\tZ_J4X(soln,g4)=Z_J4.l(g4);\n";
    aux += ");\n";
    aux += "\n";
    aux += "* Restore the solution reported to GAMS\n";
    aux += "execute_loadpoint 'biomass_gui_p.gdx';\n";
    aux += "$offecho\n";
    aux += "putclose fcpx 'solnpool solnpool.gdx' / 'solnpoolintensity 4' / 'solnpoolpop 2'/ 'PopulateLim 50'/\n";
    aux += "solve biomass_gui using mip minimizing obj;\n";
    aux += "$include readsoln\n";
    aux += "display Y_FX,Y_JX,Y_PX,Y_CX, objX,Z_J4X;\n";

    return aux;

  }

  //
  //
  //
  //
  //
  //

  displayTheCodeNeatly (code) {
    let tab = new Array(8).fill("\u00a0");
    tab = tab.join("");
    let tabbed_code = code.replace(new RegExp("\t", "g"), tab);
    let nice_code = tabbed_code.split('\n').map((line, i) => {
      return (
        <span key={i}>
          {line}
          <br/>
        </span>
      );
    })
    return nice_code;
  }

  //

  justifySpaces (string, tab_fixed_length) {
    let p = tab_fixed_length - string.length;
    p = new Array(p).fill("\u00a0");
    p = p.join(""); 
    return p;
  }

  //

  getStreamName (stage, index) {
    if(stage == 'feed') {
      return 'FEEDSTOCK';
    }
    else {
      return this.props.data.stages[stage].streams[index].name;
    }
  }

  getSupplyName (index) {
    return this.props.data.supplies[index].name;
  }

  getTechnologyName (stage, index) {
    return this.props.data.stages[stage].blocks[index].name;
  }

  getFeedstockName (index) {
    return this.props.data.feedstocks[index].name;
  }

  getOffsiteUtilityName (index) {
    return this.props.data.offsite_utilities[index].name;
  }

  getPurchasedUtilityName (index) {
    return this.props.data.purchased_utilities[index].name;
  }


  render() {
    let code = this.generateCode();
    let true_code = code.replace(new RegExp("\u00a0", "g"), " ");

    return (
      <div className="view-container">
        <div id="floating-buttons">
          <a href={'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.props.data))} download="Data.json">Export Data (JSON)</a>
          <a href={'data:text/gams;charset=utf-8,' + encodeURIComponent(true_code)} download="Program.gms">Export Code (GAMS)</a>
        </div>
        <div id="code">
          {this.displayTheCodeNeatly(code)}
        </div>
      </div>
    );
  }

}

export default ExportView;
