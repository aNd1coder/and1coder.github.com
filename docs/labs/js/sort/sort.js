/*
 @name          : 合并排序
 @description   : 算法核心是将一堆数组中前后相邻的两个有序序列合并成一个有序序列,采用递归来实现,先进行划分,再进行合并。
 */
function merge(left, right) {
    var result = [];

    while (left.length > 0 && right.length > 0) {
        if (left[0] < right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    return result.concat(left).concat(right);
}
function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    var middle = Math.floor(arr.length / 2);
    var left = arr.slice(0, middle);
    var right = arr.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}

/*
 @name          : 快速排序
 @description   : 算法核心是先在数组中选择一个枢纽值,然后将比这个枢纽值小的元素移到左边,大于枢纽值的元素移到后边,对枢纽两边的值递归进行这么操作直至只有一个元素。
 */
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    var pivot = arr.splice(Math.floor(arr.length / 2), 1)[0],
        left = [], right = [];

    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return quickSort(left).concat([pivot], quickSort(right));
}

/*
 @name          : 冒泡排序
 @description   : 算法核心是从上往下扫描数组，比较相邻两个元素，大的在数组的后面，小的在前面，如果不符合则交换二者位置。
 */
function bubbleSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    for (var i = arr.length - 1; i > 0; i--) {
        for (var j = i - 1; j > 0; j--) {
            if (arr[j] < arr[j - 1]) {
                var tmp = arr[j];
                arr[j] = arr[j - 1];
                arr[j - 1] = tmp;
            }
        }
    }
    return arr;
}

/*
 @name          : 选择排序
 @description   : 算法核心是首先在未排序序列中找到最小元素，放在排序序列的起始位置，再从未排序序列中找到最小元素放到排序序列末尾位置。
 */
function selectSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    var min, tmp;
    for (var i = 0, len = arr.length; i < len; i++) {
        min = i;

        for (var j = i + 1; j < arr.length; j++) {
            if (arr[min] > arr[j]) {
                min = j;
            }
        }

        if (min != i) {
            tmp = arr[i];
            arr[i] = arr[min];
            arr[min] = tmp;
        }
    }
    return arr;
}

/*
 @name          : 插入排序
 @description   : 算法核心是每次从无序列表中取出第一个元素，把它插入到有序表的合适位置，使有序表仍然有序。
 */
function insertSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    for (var i = 1, len = arr.length; i < len; i++) {
        var tmp = arr[i], j = i;

        while (arr[j - 1] > tmp) {
            arr[j] = arr[j - 1];
        }

        arr[j] = tmp;
    }

    return arr;
}

/*
 @name          : 原生排序
 @description   : 在sort内传入对比function就可以
 @demostration  : arr.sort(function (a, b) { return a - b });
 */


