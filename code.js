var cnvs = document.getElementById("ctx");
var ctx = cnvs.getContext('2d');
var generateMenu = document.getElementById("GenerateMenu");
var generateRight = document.getElementById("GenerateRight");

var downloadMenu = document.getElementById("DownloadMenu");
var downloadRight = document.getElementById("DownloadRight");

var worldType = document.getElementById("worldTypeSelect");

function BiomColor(val)
{
    if (val < 0.32)
    {
        return 'rgb(' + 0 + ', ' + 62 + ', ' + 178  +')';
    }
    else if (val < 0.40) 
    {
        return 'rgb(' + 9 + ', ' + 82 + ', ' + 198  +')';
    }
    else if (val < 0.45) 
    {
        return 'rgb(' + 194 + ', ' + 178 + ', ' + 128  +')';
    }
    else if (val < 0.47) 
    {
        return 'rgb(' + 164 + ', ' + 148 + ', ' + 99  +')';
    }
    else if (val < 0.49) 
    {
        return 'rgb(' + 114 + ', ' + 98 + ', ' + 49  +')';
    }
    else if (val < 0.55) 
    {
        return 'rgb(' + 120 + ', ' + 157 + ', ' + 80  +')';
    }
    else if (val < 0.62) 
    {
        return 'rgb(' + 40 + ', ' + 77 + ', ' + 0  +')';
    }
    else if (val < 0.66) 
    {
        return 'rgb(' + 60 + ', ' + 97 + ', ' + 20  +')';
    }
    else if (val < 0.68) 
    {
        return 'rgb(' + 140 + ', ' + 142 + ', ' + 123  +')';
    }
    else if (val < 0.74) 
    {
        return 'rgb(' + 160 + ', ' + 162 + ', ' + 143  +')';
    }
    else if (val < 0.80) 
    {
        return 'rgb(' + 180 + ', ' + 182 + ', ' + 163  +')';
    }
    else if (val < 0.86)
    {
        return 'rgb(' + 210 + ', ' + 210 + ', ' + 210  +')';
    }
    else 
    {
        return 'rgb(' + 235 + ', ' + 235 + ', ' + 235  +')';
    }
}
/*
function GenerateGradient() {
    let size = 512;
    let array = new Array(512).fill(new Array(512));

    let b = 0;
    for (let i = 255; i > 2; i -= 2) 
    {
        for (let x = 0; x < size; x++) 
        {
            for (let y = 0; y < size; y++) 
            {
                array[x][y] = i / 255;
            }
        }
        size--;

        b++;
    }
    return array;

}
*/

function island(x, y, w, h, r){
    var mx = w/2;
    var my = h/2;
  
    var fx = mx - Math.abs(mx - x);
    var fy = my - Math.abs(my - y);
  
    var mp = Math.min(fx, fy);
    var ms = Math.min(mx, my) - r/2;
  
    return Math.max(0,1 - mp/ms);
  }

function download()
{
    var dataURL = cnvs.toDataURL("image/png");
    var newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
}

function generate()
{
    console.log("TEste");
    var maximo = 256;

    var i, arr = [];
    for (i = 0; i < maximo; i++) {
        arr[i] = i + 1;
    }
    
    var p, n, tmp;
    for (p = arr.length; p;) {
        n = Math.random() * p-- | 0;
        tmp = arr[n];
        arr[n] = arr[p];
        arr[p] = tmp;
    }
    
    m_permutation = arr;
    
    for (let x = 0; x < 512; x++) 
    {
        for (let y = 0; y < 512; y++) 
        {
            let z = 512;

            //h *= 255;
            //ctx.fillStyle = 'rgb(' + h + ', ' + h + ', ' + h  +')';
            if (worldTypeSelect.value == "island")
            {
                let h = normalizedOctave3D_01((x * 0.01), (y * 0.01), (z * 0.01), 8, 0.56) - island(x,y,512,512,128);
                ctx.fillStyle = BiomColor(h);
			    ctx.fillRect(x, y, 1, 1);
            }
            else if(worldTypeSelect.value == "big")
            {
                let h = normalizedOctave3D_01((x * 0.01), (y * 0.01), (z * 0.01), 8, 0.56);
                ctx.fillStyle = BiomColor(h);
			    ctx.fillRect(x, y, 1, 1);  
            }
            
            //let h = normalizedOctave3D_01((x * 0.01), (y * 0.01), (z * 0.01), 8, 0.56);
			//h *= 255;
            //ctx.fillStyle = 'rgb(' + h + ', ' + h + ', ' + h  +')';
            

        }
    }
}

downloadMenu.onclick = () => 
{
   download();
};

generateMenu.onclick = () => {
    generate();
};


downloadRight.onclick = () => 
{
   download();
};

generateRight.onclick = () => {
    generate();
};







































