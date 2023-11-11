class GenerateChart {
    constructor({ chartType, data, canvasElement, source, title }) {
/**
 * Initializing the parameters as properties of the class instance.
 * The following properties will be accessed across methods of the class.
 * Also initializing IDs for the chart instances
 * for allowing chart type switches.
 */     this.chartInstance = null;
        this.chartType = chartType;
        this.data = data[0];
        this.ctx = canvasElement.getContext('2d');
        this.title = title;
        this.colors = [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(65, 124, 242, 0.2)',
            'rgba(46, 142, 78, 0.2)',
            'rgba(35, 54, 254, 0.2)',
            'rgba(34, 23, 124, 0.2)',
            'rgba(25, 241, 187, 0.2)',
            'rgba(175, 172, 142, 0.2)'
        ];

        // segregate the data accordingly based on the source
        this.labels = [];
        this.dataset1 = [];
        this.dataset2 = [];
        if (source == "totalStock") {
            this.labels = this.data.map(item => item.productID);
            this.dataset1 = this.data.map(item => item.percentage);
            if (!this.chartType) {
                this.chartType = 'doughnut';
            }
        }
        else if (source == "totalOrders") {
            Object.entries(this.data[0]).forEach(([key, value]) => {
                this.labels.push(key);
                this.dataset1.push(value);
            });
            if (!this.chartType) {
                this.chartType = 'bar';
            }
        }
        else if (source == "supplierMetric") {
            this.labels = this.data.map(item => item.productID);
            this.dataset1 = this.data.map(item => item.damagedUnits);
            if (!this.chartType) {
                this.chartType = 'bar';
            }
        }
        else if (source = 'supplierMetricCompare' && this.chartType == "comparebar") {
            this.labels = this.data.map(item => item.supplierID);
            this.dataset1 = this.data.map(item => item.TotalDamagedUnits);
            this.dataset2 = this.data.map(item => item.TotalStockLevel);
        }

        // check for the chartType and invoke the method::::
        this.chartType == 'doughnut' || this.chartType == 'pie' || this.chartType == 'polarArea' ? this.createMultiPie({
            labels: this.labels,
            data: this.dataset1,
            colors: this.colors,
            ctx: this.ctx,
            chartType: this.chartType,
            title: this.title,
        }) : this.chartType == 'bar' ? this.createBarChart({
            labels: this.labels,
            data: this.dataset1,
            colors: this.colors,
            ctx: this.ctx,
            chartType: this.chartType,
            title: this.title,
        }) : this.chartType == 'comparebar' ? this.analyseDamageRate({
            labels: this.labels,
            data: this.data,
            colors: this.colors,
            ctx: this.ctx,
            chartType: this.chartType,
            title: this.title,
        }) : null;
    }
    // CHARTS
    //  bar and compare bar chart
    createBarChart({ chartType, labels, data, colors, ctx, title }) {
        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: null,
                    data: data,
                    backgroundColor: colors,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title,
                    },
                }
            }
        })
    }
    // doughnut, pie and polar Area chart
    createMultiPie({ chartType, labels, data, colors, ctx, title }) {
        this.chartInstance = new Chart(ctx, {
            type: chartType,
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title,
                    },
                }
            }
        })
    }

    //Damaged rate analysis
    analyseDamageRate({ labels, data, chartType, colors, ctx, title }) {
        console.log(ctx);
        console.log(data);
        console.log(title);
        console.log(labels);
        this.damageRateDataset = data.map(item => {
            if (item.TotalStockLevel === 0) {
                return "Error: Stock level cannot be zero";
            } else {
                let damageRate = (item.TotalDamagedUnits / (item.TotalStockLevel + item.TotalDamagedUnits)) * 100;
                return parseFloat(damageRate.toFixed(2) + '%');
            }
        });

        console.log(this.damageRateDataset);

        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: null,
                    data: this.damageRateDataset,
                    backgroundColor: colors,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: title,
                    },
                }
            }
        })

    }

    destroyChart() {
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }
}